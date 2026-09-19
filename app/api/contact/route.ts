import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, orderId, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Insert into Supabase support_tickets
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        name,
        email,
        order_number: orderId ? orderId.trim() : null,
        message,
        status: 'OPEN',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to save support ticket in Supabase:', error);
      return NextResponse.json(
        { error: 'Could not submit your message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ticketId: data?.id,
      message: 'Thank you for reaching out. We will get back to you within 24 business hours.',
    });
  } catch (error: unknown) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Server error processing contact request.' },
      { status: 500 }
    );
  }
}
