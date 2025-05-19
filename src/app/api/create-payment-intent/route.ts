import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,{
   apiVersion: '2025-03-31.basil'
})


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tickets, eventTitle } = body;
    const { type, totalPrice, quantity, usedPoints = 0, finalAmount, discount = 0 } = tickets;
    const discountedUnitAmount = Math.round((finalAmount) / quantity);
    if (discountedUnitAmount < 50) {
      return NextResponse.json(
        { error: 'Amount too low. Minimum charge is ₹0.50' },
        { status: 400 }
      );
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${eventTitle} - ${type.name}`,
              description: usedPoints > 0 ? `Used ${usedPoints} points (₹${discount / 100} discount)` : undefined,
            },
            unit_amount: discountedUnitAmount,
          },
          quantity:tickets.quantity,
        },
      ],
      metadata: {
        points_used: usedPoints.toString(),
        original_amount: (totalPrice * 100).toString(),
        discounted_amount: (finalAmount * 100).toString(),
        discount_value: discount.toString(),
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe session creation failed:', error.message || error);
    return NextResponse.json(
      { error: error.message || 'Stripe session creation failed' },
      { status: 500 }
    );
  }
}

