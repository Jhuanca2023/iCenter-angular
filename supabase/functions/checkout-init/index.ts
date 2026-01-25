import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const authHeader = req.headers.get('Authorization')
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader ?? '' } } }
        )

        let userId: string | null = null
        if (authHeader) {
            const { data: { user } } = await supabaseClient.auth.getUser()
            userId = user?.id || null
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { items, customer } = await req.json()

        // 1. Validar items y calcular precio real desde la base de datos
        let subtotal = 0
        const orderItemsData = []

        for (const item of items) {
            const { data: product, error } = await supabaseAdmin
                .from('products')
                .select('id, name, price, sale_price, on_sale')
                .eq('id', item.productId)
                .single()

            if (error || !product) {
                throw new Error(`Producto no encontrado: ${item.productId}`)
            }

            const unitPrice = (product.on_sale && product.sale_price) ? product.sale_price : product.price
            const quantity = item.quantity

            subtotal += Number(unitPrice) * quantity

            orderItemsData.push({
                product_id: product.id,
                quantity: quantity,
                price: unitPrice
            })
        }

        // 2. Calcular envío
        const shippingCost = customer.shippingType === 'express' ? 25.00 : 15.00
        const total = subtotal + shippingCost

        // 3. Inicializar Stripe
        const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        })

        // 4. Crear PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: 'pen',
            automatic_payment_methods: { enabled: true },
            metadata: {
                customer_email: customer.email,
                customer_name: customer.fullName,
                user_id: userId || 'anonymous'
            }
        })

        // 5. Crear la orden en Supabase (Incluyendo user_id)
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: userId, // CRÍTICO: Vincular a usuario logueado
                customer_name: customer.fullName,
                customer_email: customer.email,
                total: total,
                status: 'Pendiente',
                payment_intent_id: paymentIntent.id,
                shipping_info: customer
            })
            .select()
            .single()

        if (orderError) throw new Error(`Error creando orden: ${orderError.message}`)

        // 6. Insertar items
        const itemsToInsert = orderItemsData.map(i => ({
            order_id: order.id,
            product_id: i.product_id,
            quantity: i.quantity,
            price: i.price
        }))

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(itemsToInsert)

        if (itemsError) throw new Error(`Error insertando items: ${itemsError.message}`)

        return new Response(
            JSON.stringify({
                data: {
                    clientSecret: paymentIntent.client_secret,
                    orderId: order.id,
                    totals: {
                        subtotal,
                        shippingCost,
                        total,
                        currency: 'PEN'
                    }
                }
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
