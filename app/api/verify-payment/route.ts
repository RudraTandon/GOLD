import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json(
        { error: 'Razorpay key secret is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification parameters.' },
        { status: 400 }
      );
    }

    // 1. Verify HMAC-SHA256 Signature
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);

    const isMatch =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed.' },
        { status: 400 }
      );
    }

    // 2. Update Payment record in Supabase
    const { data: paymentRecord, error: paymentFetchError } = await supabase
      .from('payments')
      .update({
        status: 'CAPTURED',
        gateway_payment_id: razorpay_payment_id,
        gateway_signature: razorpay_signature,
        verified_at: new Date().toISOString(),
      })
      .eq('gateway_order_id', razorpay_order_id)
      .select('order_id')
      .single();

    if (paymentFetchError) {
      console.warn('Could not update payment by gateway_order_id:', paymentFetchError);
    }

    const orderId = paymentRecord?.order_id;

    // 3. Update Order status to CONFIRMED
    if (orderId) {
      await supabase
        .from('orders')
        .update({ status: 'CONFIRMED' })
        .eq('id', orderId);

      // 4. Create Shipment and Tracking Events
      const { data: shipment } = await supabase
        .from('shipments')
        .insert({
          order_id: orderId,
          courier_partner: 'Delhivery',
          awb_number: `DLH${Date.now()}`,
          status: 'MANIFESTED',
        })
        .select('id')
        .single();

      if (shipment?.id) {
        await supabase.from('tracking_events').insert([
          {
            shipment_id: shipment.id,
            stage: 'Order Confirmed',
            location: 'Online Payment Verified',
            activity_description: 'Payment of ₹499 received via Razorpay. Order is confirmed.',
            event_timestamp: new Date().toISOString(),
            is_completed: true,
          },
          {
            shipment_id: shipment.id,
            stage: 'Processing',
            location: 'Central Fulfillment Hub',
            activity_description: 'Order sent to packaging unit.',
            event_timestamp: new Date().toISOString(),
            is_completed: true,
          },
        ]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error: unknown) {
    console.error('Error verifying Razorpay payment:', error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err?.message || 'Server error during payment verification.' },
      { status: 500 }
    );
  }
}
