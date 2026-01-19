import Orders from "@/components/AdminOrders/Orders";
import { getOrders } from "@/lib/queries/order";

// ensure the page is always rendered server-side on each request
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ searchParams }) {
  const params = await searchParams;

  const page = Math.max(1, Number(params?.page) || 1);
  const limit = Math.max(1, Number(params?.limit) || 10);
  const status = params.status || "all";
  const search = params.search || "";

  try {
    const { orders, total } = await getOrders({ page, limit, status, search });
    return (
      <Orders
        orders={orders}
        total={total}
        page={page}
        limit={limit}
        status={status}
        search={search}
      />
    );
  } catch (err) {
    console.error("Failed to load orders:", err);
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <p className="text-red-500">Failed to load orders.</p>
      </div>
    );
  }
}
