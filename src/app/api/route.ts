import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    return NextResponse.json({ msg: 'hi' });
}

export async function POST(req: Request) {

  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' });
  }

  const { amount } = await req.json();

  if (!amount) {
    return NextResponse.json({ error: 'Amount is required' });
  }

  try {
    
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    // Get access token
    const { data: authResponse } = await axios.post(
      `https://api-m.sandbox.paypal.com/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Create PayPal order
    const { data: orderResponse } = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              value: amount,
              currency_code: 'USD',
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${authResponse.access_token}`,
        },
      }
    );

    return NextResponse.json({ id: orderResponse.id });
  } catch (error: any) {
    console.error('PayPal order creation failed:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to create PayPal order' });
  }
}
