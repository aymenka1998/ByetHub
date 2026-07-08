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
    const orderItems = (body.items || []).map((item: any) => {
      const itemPrice = item.price ?? item.attributes?.price ?? 0;
      
      return {
        // Use Strapi v4 strict relation syntax for components
        products: item.id ? { set: [Number(item.id)] } : { set: [] }, 
        quantite: Number(item.quantity),
        price: Number(itemPrice)
      };
    });

    // In Strapi v4, payload data must be inside a `data` object
    const payload = {
      data: {
        total: Number(body.totalAmount),
        statu: 'pending', // Make sure this matches one of the Enum values in Strapi!
        orderNumber: orderNumber,
        shipping: 500,
        paymentMethod: body.paymentMethod,
        paymentStatus: 'unpaid',
        shippingAddress: {
          firstName: firstName,
          lastName: lastName,
          email: body.email,
          phone: String(body.phone),
          address: String(body.address),
          city: String(body.wilaya)
          // Omitting postalCode entirely instead of sending empty string
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
    // Return the EXACT Strapi error message so the user can see which field is wrong
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Strapi Error: ${errorMsg}`
      },
      { status: 500 }
    );
  }
}
