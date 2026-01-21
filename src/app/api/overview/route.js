import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextBuildContext } from "next/dist/build/build-context";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // total revenue
    const { data: revenueData, error: revenueError } = await supabaseAdmin
      .from("orders")
      .select("total_amount", { count: "exact" })
      .eq("payment_status", "paid");

    if (revenueError) throw revenueError;

    const totalRevenue = revenueData.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0
    );

    // total orders
    const { count: totalOrders, error: totalOrdersError } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true });

    if (totalOrdersError) throw totalOrdersError;

    // pending orders
    const { count: pendingOrders, error: pendingError } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (pendingError) throw pendingError;

    // low stock product
    const LOW_STOCK_THRESHOLD = 5;

    const { count: lowStock, error: lowStockError } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .lte("stock", LOW_STOCK_THRESHOLD);

    if (lowStockError) throw lowStockError;

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      lowStock,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { error: "failed to load dashboard data" },
      { status: 500 }
    );
  }
}
