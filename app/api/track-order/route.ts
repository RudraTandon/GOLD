import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('orderId')?.trim();

    if (!query) {
      return NextResponse.json(
        { error: 'Order ID is required.' },
        { status: 400 }
      );
    }

    // 1. Query Order from Supabase
    let orderQuery = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        payment_method,
        total_amount,
        created_at,
        shipping_address:addresses (
          city,
          state,
          pincode
        ),
        order_items (
          variant_id,
          unit_price,
          quantity,
          snapshot
        ),
        shipments (
          id,
          courier_partner,
          awb_number,
          status,
          estimated_delivery_date,
          tracking_events (
            id,
            stage,
            location,
            activity_description,
            event_timestamp,
            is_completed
          )
        )
      `);

    // Match by order_number (e.g. TND-984712), numbers only (708325), or UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query);

    if (query.toUpperCase().startsWith('TND-')) {
      orderQuery = orderQuery.ilike('order_number', query);
    } else if (isUuid) {
      orderQuery = orderQuery.or(`order_number.ilike.%${query}%,id.eq.${query}`);
    } else if (/^\d+$/.test(query)) {
      // User entered numeric digits only (e.g. 708325)
      orderQuery = orderQuery.or(`order_number.ilike.TND-${query},order_number.ilike.%${query}%`);
    } else {
      orderQuery = orderQuery.ilike('order_number', `%${query}%`);
    }

    const { data: orders, error: orderError } = await orderQuery.limit(1);

    if (orderError) {
      console.error('Supabase track query error:', orderError);
      return NextResponse.json(
        { error: 'Failed to query order tracking.' },
        { status: 500 }
      );
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: `No active order found with ID "${query}". Please check your order number.` },
        { status: 404 }
      );
    }

    const order = orders[0];
    const shipment = order.shipments?.[0];
    const trackingEvents = (shipment?.tracking_events || []).sort(
      (a: any, b: any) =>
        new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime()
    );

    // Default timeline stages to display
    const standardStages = [
      {
        stage: 'Order Confirmed',
        desc: 'We have received your order.',
        icon: 'check',
      },
      {
        stage: 'Processing',
        desc: 'Your order is being packed and prepared for dispatch.',
        icon: 'box',
      },
      {
        stage: 'Shipped',
        desc: shipment?.courier_partner
          ? `Package handed over to ${shipment.courier_partner} (AWB: ${shipment.awb_number || 'Pending'}).`
          : 'Package handed over to our delivery partner.',
        icon: 'truck',
      },
      {
        stage: 'Out for Delivery',
        desc: 'Your package is out for delivery in your city.',
        icon: 'package',
      },
      {
        stage: 'Delivered',
        desc: 'The package has been delivered successfully.',
        icon: 'check',
      },
    ];

    // Determine current progress
    const orderStatus = order.status;
    let activeIndex = 1; // Processing by default for confirmed orders
    if (orderStatus === 'SHIPPED') activeIndex = 2;
    if (orderStatus === 'OUT_FOR_DELIVERY') activeIndex = 3;
    if (orderStatus === 'DELIVERED') activeIndex = 4;

    const timeline = standardStages.map((s, idx) => {
      const match = trackingEvents.find((e: any) => e.stage.toLowerCase() === s.stage.toLowerCase());
      return {
        stage: s.stage,
        description: match?.activity_description || s.desc,
        location: match?.location || null,
        timestamp: match?.event_timestamp || (idx <= activeIndex ? order.created_at : null),
        isActive: idx <= activeIndex,
      };
    });

    const shippingAddr: any = Array.isArray(order.shipping_address)
      ? order.shipping_address[0]
      : order.shipping_address;

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      status: order.status,
      paymentMethod: order.payment_method,
      totalAmount: order.total_amount,
      destination: `${shippingAddr?.city || ''}, ${shippingAddr?.state || ''}`,
      courierPartner: shipment?.courier_partner || 'Delhivery',
      awbNumber: shipment?.awb_number || 'Pending Dispatch',
      items: order.order_items || [],
      timeline,
    });
  } catch (error: unknown) {
    console.error('Error in track-order endpoint:', error);
    return NextResponse.json(
      { error: 'Server error processing tracking request.' },
      { status: 500 }
    );
  }
}
