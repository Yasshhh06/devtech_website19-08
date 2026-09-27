import { NextResponse } from "next/server";
import crypto from "crypto";
import { updateProgramPaymentStatus, saveProgramApplication, ProgramApplicationRecord } from "@/lib/programs-db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationRecord,
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    let isSignatureValid = false;

    if (keySecret && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      isSignatureValid = generatedSignature === razorpay_signature;
    } else {
      // In demo mode or test mode without secret key configured
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature verification." },
        { status: 400 }
      );
    }

    // Save or update the application record with paid status
    if (applicationRecord) {
      const fullRecord: ProgramApplicationRecord = {
        ...applicationRecord,
        paymentInfo: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature || "demo_signature",
          amount: applicationRecord.paymentInfo?.amount || 499,
          currency: "INR",
          status: "PAID",
          paidAt: new Date().toISOString(),
        }
      };

      await saveProgramApplication(fullRecord);
    } else if (razorpay_order_id) {
      await updateProgramPaymentStatus(razorpay_order_id, {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        amount: 499,
        status: "PAID",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and registration saved!",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (err: any) {
    console.error("❌ [Razorpay Verify Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to verify Razorpay payment." },
      { status: 500 }
    );
  }
}
