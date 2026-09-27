import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount = 499, currency = "INR", receiptId = `receipt_${Date.now()}` } = body;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    if (keyId && keySecret) {
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await instance.orders.create({
        amount: Math.round(amount * 100), // amount in paise
        currency: currency,
        receipt: receiptId,
        notes: {
          program: "DevTech Internship & Program Registration",
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId,
      });
    }

    // Demo / Fallback mode if Razorpay credentials are not yet added to .env.local
    const mockOrderId = `order_demo_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    console.warn("⚠️ [Razorpay Warning] RAZORPAY_KEY_ID / SECRET not set in env. Returning demo order ID for testing.");

    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: Math.round(amount * 100),
      currency: currency,
      keyId: keyId || "rzp_test_demo_key",
      isDemo: true,
    });
  } catch (err: any) {
    console.error("❌ [Razorpay Error] Failed to create order:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create Razorpay payment order." },
      { status: 500 }
    );
  }
}
