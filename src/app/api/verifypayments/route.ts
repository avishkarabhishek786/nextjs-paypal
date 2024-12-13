import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request, res: NextResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' });
  }

  const { orderID } = await req.json() || req.body;

  if (!orderID) {
    return NextResponse.json({ error: 'Order ID is required' });
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

    // Verify PayPal order
    const { data: orderDetails } = await axios.get(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}`,
      {
        headers: {
          Authorization: `Bearer ${authResponse.access_token}`,
        },
      }
    );

    // Validate the order amount
    if (orderDetails.purchase_units[0].amount.value !== '20.00') {
      return NextResponse.json({ error: 'Invalid order amount' });
    }

    return NextResponse.json({ message: 'Payment verified successfully', orderDetails });
  } catch (error: any) {
    console.error('PayPal verification failed:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to verify PayPal payment' });
  }
}
