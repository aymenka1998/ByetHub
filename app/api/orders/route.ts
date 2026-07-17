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

    // 1. Validate cart items
    const clientItems = body.items || [];
    if (!clientItems || clientItems.length === 0) {
      throw new Error('السلة فارغة.');
    }

    // 2. Fetch real products from Strapi securely to prevent price manipulation
    const productIds = clientItems.map((i: any) => Number(i.id)).filter((id: number) => !isNaN(id));
    const queryParams = productIds.map((id: number) => `filters[id][$in]=${id}`).join('&');
    
    // Use the backend fetchAPI to get authentic prices
    const productsRes = await fetchAPI<any>(`/products?${queryParams}`);
    const realProducts = productsRes?.data || [];

    let calculatedTotal = 0;

    // 3. Map order items with real prices from database
    const orderItems = clientItems.map((item: any) => {
      const productId = Number(item.id);
      const quantity = Number(item.quantity) || 1;
      
      const realProduct = realProducts.find((p: any) => p.id === productId);
      if (!realProduct) {
        throw new Error(`المنتج رقم ${productId} غير موجود أو تم حذفه.`);
      }

      const realPrice = Number(realProduct.attributes.price) || 0;
      calculatedTotal += realPrice * quantity;

      return {
        // Use Strapi v4 strict relation syntax for components
        products: { set: [productId] }, 
        quantite: quantity,
        price: realPrice // Save the unit price at time of purchase
      };
    });

    const SHIPPING_COST = 500;
    const finalTotal = calculatedTotal + SHIPPING_COST;

    // In Strapi v4, payload data must be inside a `data` object
    const payload = {
      data: {
        total: finalTotal,
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
    console.error('Failed to create order securely:', error);
    // Return a generic user-friendly message to prevent internal data leakage
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء معالجة الطلب، يرجى المحاولة لاحقاً أو التواصل مع الدعم.'
      },
      { status: 500 }
    );
  }
}
