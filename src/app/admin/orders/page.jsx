import Orders from "@/components/AdminOrders/Orders";
import { getOrders } from "@/lib/queries/order";


export default async function DashboardOrders() {
  const orders = await getOrders();

  return (
    <main>
      <Orders orders={orders} />
    </main>
  );
}
