import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      customer,
      shippingAddress,
      paymentMethod = 'online',
      variantId = 'luxe-royal-gold',
      quantity = 1,
      items: incomingItems,
    } = body;

    // Validate customer contact
    const fullName = customer?.fullName || shippingAddress?.fullName || 'Valued Customer';
    const mobile = customer?.mobile || shippingAddress?.mobile || '';
    const email = customer?.email || shippingAddress?.email || 'customer@example.com';

    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required.' },
        { status: 400 }
      );
    }

    // Determine items & pricing
    const isCod = paymentMethod === 'cod';
    let subtotal = 0;
    let orderItemsToInsert: any[] = [];

    if (Array.isArray(incomingItems) && incomingItems.length > 0) {
      subtotal = incomingItems.reduce((acc: number, it: any) => {
        const itemPrice = Number(it.price) || 499.0;
        const itemQty = Math.max(1, Number(it.quantity) || 1);
        return acc + itemPrice * itemQty;
      }, 0);

      orderItemsToInsert = incomingItems.map((it: any) => {
        const itemPrice = Number(it.price) || 499.0;
        const itemQty = Math.max(1, Number(it.quantity) || 1);
        const vid = it.id === 'luxe-royal-chrono' ? 'luxe-royal-chrono' : 'luxe-royal-gold';
        return {
          variant_id: vid,
          unit_price: itemPrice,
          quantity: itemQty,
          total_price: itemPrice * itemQty,
          snapshot: {
            variant_id: vid,
            name: it.name || (vid === 'luxe-royal-chrono' ? 'TANDO Luxe Royal Chrono Watch Combo' : 'TANDO Luxe Royal Gold Watch Combo'),
            image: it.image || (vid === 'luxe-royal-chrono' ? '/black-combo.jpg' : '/gold-combo.jpg'),
          },
        };
      });
    } else {
      const unitPrice = 499.0;
      const qty = Math.max(1, Number(quantity) || 1);
      subtotal = unitPrice * qty;
      const vid = variantId === 'luxe-royal-chrono' ? 'luxe-royal-chrono' : 'luxe-royal-gold';
      orderItemsToInsert = [
        {
          variant_id: vid,
          unit_price: unitPrice,
          quantity: qty,
          total_price: subtotal,
          snapshot: {
            variant_id: vid,
            name:
              vid === 'luxe-royal-chrono'
                ? 'TANDO Luxe Royal Chrono Watch Combo'
                : 'TANDO Luxe Royal Gold Watch Combo',
            image: vid === 'luxe-royal-chrono' ? '/black-combo.jpg' : '/gold-combo.jpg',
          },
        },
      ];
    }

    const codFee = isCod ? 50.0 : 0.0;
    const totalAmount = subtotal + codFee;

    // Generate unique order number (e.g. TND-849102)
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `TND-${randomDigits}`;

    // 1. Insert Shipping Address into Supabase
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .insert({
        full_name: fullName,
        phone: mobile,
        email: email,
        address_line: shippingAddress?.address || 'Street address',
        landmark: shippingAddress?.landmark || null,
        city: shippingAddress?.city || 'City',
        state: shippingAddress?.state || 'State',
        pincode: shippingAddress?.pinCode || '000000',
      })
      .select('id')
      .single();

    if (addressError) {
      console.error('Failed to create address in Supabase:', addressError);
      return NextResponse.json(
        { error: 'Failed to record shipping address. Please verify your details.' },
        { status: 500 }
      );
    }

    const addressId = addressData.id;

    // 2. Insert Order into Supabase
    // Note: Supabase payment_method_enum values: ('ONLINE_RAZORPAY', 'CASH_ON_DELIVERY')
    const initialStatus = isCod ? 'CONFIRMED' : 'PENDING_PAYMENT';
    const dbPaymentMethod = isCod ? 'CASH_ON_DELIVERY' : 'ONLINE_RAZORPAY';

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        shipping_address_id: addressId,
        status: initialStatus,
        payment_method: dbPaymentMethod,
        subtotal_amount: subtotal,
        cod_fee_amount: codFee,
        discount_amount: 0.0,
        total_amount: totalAmount,
        notes: isCod ? 'Cash on Delivery' : 'Instant UPI QR Payment',
      })
      .select('id, order_number')
      .single();

    if (orderError || !orderData) {
      console.error('Failed to create order in Supabase:', orderError);
      return NextResponse.json(
        { error: 'Failed to record order in database. Please try again.' },
        { status: 500 }
      );
    }

    const orderId = orderData.id;

    // 3. Insert Order Items
    for (const item of orderItemsToInsert) {
      await supabase.from('order_items').insert({
        order_id: orderId,
        variant_id: item.variant_id,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total_price: item.total_price,
        snapshot: item.snapshot,
      });
    }

    // 4. Handle COD Order directly
    if (isCod) {
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
            location: shippingAddress?.city || 'Warehouse Hub',
            activity_description: 'We have received your COD order and it is verified.',
            event_timestamp: new Date().toISOString(),
            is_completed: true,
          },
          {
            shipment_id: shipment.id,
            stage: 'Processing',
            location: 'Fulfillment Center',
            activity_description: 'Your combo is being packed and prepared for dispatch.',
            event_timestamp: new Date().toISOString(),
            is_completed: true,
          },
        ]);
      }

      return NextResponse.json({
        success: true,
        order_number: orderNumber,
        total_amount: totalAmount,
        payment_method: 'cod',
      });
    }

    // 5. Handle Online Payment with UPI QR Code
    const upiId = 'rudratandon2007@oksbi';
    const payeeName = 'Rudra Tandon';

    // Save pending payment record in Supabase
    await supabase.from('payments').insert({
      order_id: orderId,
      payment_method: 'ONLINE_RAZORPAY',
      gateway: 'UPI_QR',
      gateway_order_id: orderNumber,
      amount: totalAmount,
      currency: 'INR',
      status: 'PENDING',
    });

    return NextResponse.json({
      success: true,
      order_id: orderNumber,
      order_number: orderNumber,
      amount: totalAmount,
      currency: 'INR',
      payment_method: 'online_upi',
      upi_id: upiId,
      payee_name: payeeName,
      qr_image: '/upi-qr.jpg',
    });
  } catch (error: unknown) {
    console.error('Error in create-order route:', error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err?.message || 'Failed to create order.' },
      { status: 500 }
    );
  }
}
