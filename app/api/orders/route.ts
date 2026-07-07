import { NextResponse } from 'next/server';
import { fetchAPI } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Split full name to firstName and lastName
    const nameParts = (body.name || '').trim().split(' ');
    const firstName = nameParts[0] || 'زبون';
    const lastName = nameParts.slice(1).join(' ') || '-';

    // Generate random order number
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Map cart items to Strapi repeatable component
    // Note: products relation in Strapi v4 expects an array of IDs for manyWay relation
    const orderItems = (body.items || []).map((item: any) => ({
      products: [item.id], 
      quantite: item.quantity,
      price: item.price
    }));

    // In Strapi v4, payload data must be inside a `data` object
    const payload = {
      data: {
        total: body.totalAmount,
        statu: 'pending', // Make sure this matches one of the Enum values in Strapi
        orderNumber: orderNumber,
        shipping: 500, // Assuming 500 based on checkout logic
        paymentMethod: body.paymentMethod,
        paymentStatus: 'unpaid',
        shippingAddress: {
          firstName: firstName,
          lastName: lastName,
          email: body.email,
          phone: body.phone,
          address: body.address,
          city: body.wilaya,
          postalCode: ''
        },
        orderItems: orderItems
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
        message: 'Failed to create order. Please check Strapi schema matches exactly.',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
