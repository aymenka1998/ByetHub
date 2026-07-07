import { NextResponse } from 'next/server';
import { fetchAPI } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // In Strapi v4, payload data must be inside a `data` object
    const payload = {
      data: {
        fullName: body.name,
        email: body.email,
        phone: body.phone,
        wilaya: body.wilaya,
        address: body.address,
        paymentMethod: body.paymentMethod,
        totalAmount: body.totalAmount,
        items: JSON.stringify(body.items), // Send as JSON string for maximum compatibility
        status: 'pending',
      },
    };

    const response = await fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Failed to create order in Strapi:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create order. Please make sure you have an "orders" collection in Strapi with matching fields.',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
