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

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object
        const paymentIntentId = paymentIntent.id

        console.log(`Pago exitoso: ${paymentIntentId}`)

        // 1. Buscar la orden
        const { data: order, error: findError } = await supabaseAdmin
            .from('orders')
            .select('id')
            .eq('payment_intent_id', paymentIntentId)
            .single()

        if (findError || !order) {
            console.error('Orden no encontrada para payment_intent:', paymentIntentId)
            return new Response('Order not found', { status: 200 }) // Return 200 to acknowledge Stripe
        }

        // 2. Actualizar estado de orden
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({ status: 'Completado' }) // O 'Pagado'
            .eq('id', order.id)

        if (updateError) {
            console.error('Error actualizando orden:', updateError)
            return new Response('Error updating order', { status: 500 })
        }

        // 3. Reducir stock
        // Obtenemos los items de la orden
        const { data: items, error: itemsError } = await supabaseAdmin
            .from('order_items')
            .select('product_id, quantity')
            .eq('order_id', order.id)

        if (items && !itemsError) {
            for (const item of items) {
                // Llamada RPC o update directo. Update directo es más simple si no hay concurrencia extrema.
                // Mejor: usar rpc 'decrement_stock' si existiera, pero haremos update directo por ahora.

                // Primero obtener stock actual para seguridad (o usar decrement sql: stock = stock - quantity)
                // RPC es mejor para atomicidad, pero haremos una consulta simple para este ejemplo.

                // Ojo: Supabase no soporta "stock = stock - x" directamente en JS client update sin rpc.
                // Vamos a leer y escribir. (O crear una funcion RPC).

                // Vamos a crear una funcion RPC en SQL si queremos ser robustos.
                // Pero para simplificar en el código "user-side", llamaremos a una funcion RPC si puedo, 
                // o leeremos y actualizaremos (riesgo de race condition bajo en e-commerce pequeño).

                // Vamos a leer el producto actual
                const { data: product } = await supabaseAdmin
                    .from('products')
                    .select('stock')
                    .eq('id', item.product_id)
                    .single()

                if (product) {
                    const newStock = Math.max(0, product.stock - item.quantity)
                    await supabaseAdmin
                        .from('products')
                        .update({ stock: newStock })
                        .eq('id', item.product_id)
                }
            }
        }
    } else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object
        console.log('Pago fallido:', paymentIntent.id)
        // Podríamos marcar la orden como cancelada o fallida
        await supabaseAdmin
            .from('orders')
            .update({ status: 'Cancelado' }) // o 'Error Pago'
            .eq('payment_intent_id', paymentIntent.id)
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    })
})
