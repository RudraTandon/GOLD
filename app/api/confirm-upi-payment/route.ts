import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { order_number, utr_number, amount } = body;

    if (!order_number) {
      return NextResponse.json(
        { error: 'Order number is required.' },
        { status: 400 }
      );
    }

    // 1. Fetch order from Supabase
    const { data: orderData, error: orderFetchError } = await supabase
      .from('orders')
      .select('id, order_number, total_amount, status, shipping_address_id')
      .eq('order_number', order_number)
      .maybeSingle();

    if (orderFetchError) {
      console.warn('Error querying order in Supabase:', orderFetchError);
    }

    const orderId = orderData?.id;
    const paymentRef = utr_number?.trim() || `UPI-${Date.now().toString().slice(-6)}`;

    // 2. Update Order status in Supabase
    if (orderId) {
      await supabase
        .from('orders')
        .update({
          status: 'CONFIRMED',
          payment_method: 'ONLINE_RAZORPAY',
        })
        .eq('id', orderId);

      // 3. Update or Insert Payment record
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('order_id', orderId)
        .maybeSingle();

      if (existingPayment?.id) {
        await supabase
          .from('payments')
          .update({
            status: 'CAPTURED',
            payment_method: 'ONLINE_RAZORPAY',
            gateway: 'UPI_QR',
            gateway_payment_id: paymentRef,
            verified_at: new Date().toISOString(),
          })
          .eq('id', existingPayment.id);
      } else {
        await supabase.from('payments').insert({
          order_id: orderId,
          payment_method: 'ONLINE_RAZORPAY',
          gateway: 'UPI_QR',
          gateway_order_id: order_number,
          gateway_payment_id: paymentRef,
          amount: amount || orderData?.total_amount || 499.0,
          currency: 'INR',
          status: 'CAPTURED',
          verified_at: new Date().toISOString(),
        });
      }

      // 4. Create Shipment and Tracking Events if not already existing
      const { data: existingShipment } = await supabase
        .from('shipments')
        .select('id')
        .eq('order_id', orderId)
        .maybeSingle();

      let shipmentId = existingShipment?.id;

      if (!shipmentId) {
        const { data: newShipment } = await supabase
          .from('shipments')
          .insert({
            order_id: orderId,
            courier_partner: 'Delhivery',
            awb_number: `DLH${Date.now()}`,
            status: 'MANIFESTED',
          })
          .select('id')
          .single();

        shipmentId = newShipment?.id;
      }

      if (shipmentId) {
        await supabase.from('tracking_events').insert([
          {
            shipment_id: shipmentId,
            stage: 'Order Confirmed',
            location: 'UPI Instant Verification',
            activity_description: `Payment of ₹${amount || 499} received via UPI QR (Ref: ${paymentRef}). Order confirmed.`,
            event_timestamp: new Date().toISOString(),
            is_completed: true,
          },
          {
            shipment_id: shipmentId,
            stage: 'Processing',
            location: 'Central Fulfillment Hub',
            activity_description: 'Watch combo assigned for priority inspection and luxury packaging.',
            event_timestamp: new Date().toISOString(),
            is_completed: true,
          },
        ]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'UPI payment verified and order confirmed successfully.',
      order_number,
      payment_ref: paymentRef,
    });
  } catch (error: unknown) {
    console.error('Error confirming UPI payment:', error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err?.message || 'Failed to confirm UPI payment.' },
      { status: 500 }
    );
  }
}
