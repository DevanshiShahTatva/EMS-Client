import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tickets, eventTitle } = body;
    const { type, totalPrice, quantity, usedPoints, finalAmount, discount } = tickets;

    const discountedUnitAmount = finalAmount / quantity;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${eventTitle} - ${type}`,
              description: `Used ${usedPoints} points (₹${discount / 100} discount)`,
            },
            unit_amount: discountedUnitAmount
          },
          quantity: tickets.quantity,
        },
      ],
      metadata: {
        points_used: usedPoints,
        original_amount: totalPrice * 100,
        discounted_amount: finalAmount,
        discount_value: discount
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events`,
    })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Stripe session creation failed' }, { status: 500 })
  }
}
