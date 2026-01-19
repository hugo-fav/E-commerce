import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { customer, items, totalAmount } = body || {};

    // basic validation
    if (
      !customer ||
      !customer.email ||
      !items ||
      !Array.isArray(items) ||
      !totalAmount
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing PAYSTACK_SECRET_KEY" },
        { status: 500 }
      );
    }

    const reference = `ORD-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    // 1️⃣ Create order (unpaid)
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          reference,
          user_name: customer.fullName,
          user_email: customer.email,
          user_phone: customer.phone,
          delivery_address: customer.address,
          total_amount: totalAmount,
          payment_status: "unpaid",
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2️⃣ Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);
    if (itemsError) throw itemsError;

    // 3️⃣ Initialize Paystack payment
    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/order-success/${order.id}`;

    // process.env.PAYSTACK_CALLBACK_URL ||
    // `${process.env.NEXT_PUBLIC_SITE_URL || ""}/order-success/${order.id}`;

    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customer.email,
          amount: Math.round(Number(totalAmount) * 100), // in kobo
          reference,
          callback_url: callbackUrl,
          metadata: { order_id: order.id },
        }),
      }
    );

    const paystackData = await paystackRes.json();
    if (!paystackData?.status) {
      console.error("Paystack init failed:", paystackData);
      throw new Error("Paystack initialization failed");
    }

    return NextResponse.json(
      { authorization_url: paystackData.data.authorization_url },
      { status: 200 }
    );
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
