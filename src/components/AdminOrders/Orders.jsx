"use client";

import { useState, Fragment, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Orders({
  orders = [],
  total = 0,
  page = 1,
  limit = 10,
  status = "all",
  search = "",
}) {
  const router = useRouter();
  const searchParamsObj = useSearchParams();

  const [orderList, setOrderList] = useState(orders);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // keep local state in sync when server props change (fixes pagination not updating)
  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  const changeStatusFilter = (value) => {
    const params = new URLSearchParams(searchParamsObj?.toString() || "");
    params.set("status", value);
    params.set("page", "1"); // reset page on filter change
    router.push(`/admin/orders?${params.toString()}`);
  };

  const onSearch = (value) => {
    const query = new URLSearchParams(searchParamsObj?.toString() || "");
    if (value) query.set("search", value);
    else query.delete("search");
    query.set("page", "1"); // reset page on search
    router.push(`/admin/orders?${query.toString()}`);
  };

  const updateStatus = async (orderId, status) => {
    const prevList = orderList;
    setOrderList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setUpdatingId(orderId);

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || "Failed to update order");

      const updated =
        payload.updatedOrder || payload.updated || payload.order || null;
      if (updated) {
        setOrderList((prev) =>
          prev.map((o) => (o.id === orderId ? updated : o))
        );
      }
    } catch (err) {
      console.error("updateStatus error:", err);
      setOrderList(prevList); // revert optimistic update
    } finally {
      setUpdatingId(null);
    }
  };

  if (!orderList || orderList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <p className="text-gray-500 text-center">No orders found</p>
      </div>
    );
  }

  const goToPage = (newPage) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>

        <div className="mb-4 w-full md:w-auto">
          <input
            type="text"
            defaultValue={search}
            placeholder="Search by name, email, phone, or reference"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full md:w-96 border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <select
          value={status}
          onChange={(e) => changeStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg bg-white">
          {/* table heading */}
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Address
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Total (₦)
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Payment
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Items
              </th>
            </tr>
          </thead>

          <tbody>
            {orderList.map((order, idx) => (
              <Fragment key={order.id}>
                <tr
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-3 text-sm">{order.user_name}</td>
                  <td className="px-4 py-3 text-sm">{order.user_phone}</td>
                  <td className="px-4 py-3 text-sm">{order.user_email}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.delivery_address}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    ₦{Number(order.total_amount || 0).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white"
                      disabled={updatingId === order.id}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : order.payment_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        setOpenOrderId(
                          openOrderId === order.id ? null : order.id
                        )
                      }
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {openOrderId === order.id
                        ? "Hide"
                        : `View (${order.order_items?.length || 0})`}
                    </button>
                  </td>
                </tr>

                {openOrderId === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={9} className="px-6 py-4">
                      <div className="space-y-3">
                        {(order.order_items || []).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 border rounded-lg p-3 bg-white"
                          >
                            <img
                              src={
                                item.products?.images?.[0] || "/placeholder.png"
                              }
                              alt={item.products?.name || "Product image"}
                              loading="lazy"
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {item.products?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">
                                ₦{Number(item.price || 0).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                ₦{Number(item.price || 0).toLocaleString()} ×{" "}
                                {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ORDER STATUS TIMELINE */}
                      {order.order_status_history?.length > 0 && (
                        <>
                          <h3 className="text-sm font-semibold mb-3 text-gray-700">
                            Status History
                          </h3>

                          <ol className="space-y-2 border-l border-gray-300 pl-4">
                            {order.order_status_history.map((h) => (
                              <li key={h.id} className="relative">
                                <span className="absolute -left-3 top-1 w-3 h-3 bg-black rounded-full" />
                                <div className="ml-2">
                                  <p className="text-sm font-medium capitalize">
                                    {h.status}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(h.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          className="text-sm text-blue-600 disabled:text-gray-400"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          className="text-sm text-blue-600 disabled:text-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Orders;
