import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
    const signature = req.headers.get('Stripe-Signature')

    // Importante: necesitamos el body como texto crudo para validar la firma
    const body = await req.text()

    let event
    try {
        event = await stripe.webhooks.constructEventAsync(
            body,
            signature!,
            Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '',
            undefined,
            cryptoProvider
        )
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`Received event type: ${event.type}`)

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object
        const paymentIntentId = paymentIntent.id

        console.log(`Processing successful payment: ${paymentIntentId}`)

        // 1. Buscar la orden
        const { data: order, error: findError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('payment_intent_id', paymentIntentId)
            .maybeSingle()

        if (findError) {
            console.error(`Error searching order for PI ${paymentIntentId}:`, findError.message)
            return new Response(JSON.stringify({ error: findError.message }), { status: 500 })
        }

        if (!order) {
            console.warn(`Order NOT FOUND in database for PI: ${paymentIntentId}`)
            // We return 200 because Stripe will retry if we return 404, but if it's not there it's likely a sync issue
            return new Response(JSON.stringify({ error: 'Order not found' }), { status: 200 })
        }

        console.log(`Found order ${order.id}. Current status: ${order.status}`)

        // Si ya está completada, no hacer nada (prevenir doble descuento de stock)
        if (order.status === 'Completado') {
            console.log(`Order ${order.id} already processed. Skipping.`)
            return new Response(JSON.stringify({ message: 'Already processed' }), { status: 200 })
        }

        // 2. Actualizar estado de orden
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({ status: 'Completado' })
            .eq('id', order.id)

        if (updateError) {
            console.error(`Error updating order ${order.id} status:`, updateError.message)
            return new Response(JSON.stringify({ error: 'DB Update Error' }), { status: 500 })
        }

        console.log(`Order ${order.id} marked as Completado.`)

        // 3. Reducir stock
        const { data: items, error: itemsError } = await supabaseAdmin
            .from('order_items')
            .select('product_id, quantity')
            .eq('order_id', order.id)

        if (itemsError) {
            console.error(`Error fetching items for order ${order.id}:`, itemsError.message)
        } else if (items) {
            console.log(`Reducing stock for ${items.length} items of order ${order.id}`)
            for (const item of items) {
                // Get current product
                const { data: product, error: pError } = await supabaseAdmin
                    .from('products')
                    .select('stock, name')
                    .eq('id', item.product_id)
                    .single()

                if (pError) {
                    console.error(`Error fetching product ${item.product_id}:`, pError.message)
                    continue
                }

                if (product) {
                    const newStock = Math.max(0, product.stock - item.quantity)
                    console.log(`Setting new stock for ${product.name}: ${newStock} (was ${product.stock})`)

                    const { error: stockUpdateError } = await supabaseAdmin
                        .from('products')
                        .update({ stock: newStock })
                        .eq('id', item.product_id)

                    if (stockUpdateError) {
                        console.error(`Failed to update stock for ${item.product_id}:`, stockUpdateError.message)
                    }
                }
            }
        }
    } else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object
        console.warn('Payment failed for PI:', paymentIntent.id)
        await supabaseAdmin
            .from('orders')
            .update({ status: 'Cancelado' })
            .eq('payment_intent_id', paymentIntent.id)
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    })
})
