"use client";

import { useState, Fragment } from "react";

function Orders({ orders }) {
  const [openOrderId, setOpenOrderId] = useState(null);

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <p className="text-gray-500 text-center">No orders found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg bg-white">
          {/* HEADER */}
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
                Items
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {orders.map((order, idx) => (
              <Fragment key={order.id}>
                {/* MAIN ORDER ROW */}
                <tr
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {order.user_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.user_phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.user_email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.delivery_address}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">
                    ₦{order.total_amount}
                  </td>

                  {/* ORDER STATUS */}
                  <td className="px-4 py-3 text-center">
                    <select
                      value={order.status}
                      onChange={async (e) => {
                        await fetch("/api/admin/orders", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            orderId: order.id,
                            status: e.target.value,
                          }),
                        });
                        window.location.reload(); // quick fix for now
                      }}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* PAYMENT STATUS */}
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

                  {/* VIEW ITEMS BUTTON */}
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

                {/* ORDER ITEMS ROW */}
                {openOrderId === order.id && order.order_items?.length > 0 && (
                  <tr className="bg-gray-50">
                    <td colSpan="8" className="px-6 py-4">
                      <div className="space-y-3">
                        {order.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 border rounded-lg p-3 bg-white"
                          >
                            <img
                              src={
                                item.products?.images?.[0] || "/placeholder.png"
                              }
                              alt={item.products?.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                {item.products?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-800">
                                ₦{item.price}
                              </p>
                              <p className="text-xs text-gray-500">
                                ₦{item.price} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
