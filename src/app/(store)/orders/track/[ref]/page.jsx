import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function TrackOrderPage({ params }) {
  const { ref } = await params;

  if (!ref) notFound();

  const STATUS_STEPS = ["pending", "processing", "shipped", "completed"];

  const STATUS_INFO = {
    pending: {
      title: "Order Received",
      description:
        "We’ve received your order and it’s waiting to be processed.",
      badge: "bg-gray-200 text-gray-800",
    },
    processing: {
      title: "Order Processing",
      description:
        "Your order has been confirmed and is being prepared for shipment.",
      badge: "bg-blue-100 text-blue-800",
    },
    shipped: {
      title: "Order Shipped",
      description: "Your order has been shipped and is on its way to you.",
      badge: "bg-purple-100 text-purple-800",
    },
    completed: {
      title: "Order Delivered",
      description:
        "Your order has been delivered successfully. Thank you for shopping with us!",
      badge: "bg-green-100 text-green-800",
    },
    cancelled: {
      title: "Order Cancelled",
      description:
        "This order was cancelled. If this wasn’t expected, please contact support.",
      badge: "bg-red-100 text-red-800",
    },
  };

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            name,
            images
          )
        )
      `
    )
    .eq("reference", ref)
    .single();

  if (error || !order) notFound();

  const { data: history } = await supabaseAdmin
    .from("order_status_history")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  function getEstimatedDelivery(order) {
    const createdAt = new Date(order.created_at);

    let daysToAdd = 0;

    switch (order.status) {
      case "pending":
      case "processing":
        daysToAdd = 5;
        break;
      case "shipped":
        daysToAdd = 2;
        break;
      case "completed":
        return "Delivered";
      default:
        daysToAdd = 5;
    }

    const estimatedDate = new Date(createdAt);
    estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);

    return estimatedDate.toDateString();
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const statusInfo = STATUS_INFO[order.status];
  const estimatedDelivery = getEstimatedDelivery(order);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Track Your Order</h1>
        <p className="text-gray-500 mt-1">
          Reference: <span className="font-medium">{order.reference}</span>
        </p>
      </div>

      {/* STATUS CARD */}
      <div className="bg-white border rounded-xl p-6 mb-10 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">
              Order Status
            </p>
            <h2 className="text-xl font-semibold mt-1">{statusInfo?.title}</h2>
            <p className="text-sm text-gray-600 mt-2 max-w-xl">
              {statusInfo?.description}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusInfo?.badge}`}
          >
            {order.status}
          </span>
        </div>

        {/* PROGRESS TRACKER */}
        <div className="mt-8">
          <div className="flex items-center">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                      ${
                        isCompleted
                          ? "bg-green-600 text-white"
                          : isCurrent
                          ? "bg-black text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    {index + 1}
                  </div>

                  {index !== STATUS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-3 rounded
                        ${isCompleted ? "bg-green-600" : "bg-gray-300"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ORDER DETAILS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="border rounded-xl p-5 bg-gray-50">
          <p className="text-sm text-gray-500">Payment Status</p>
          <p className="font-medium capitalize">{order.payment_status}</p>
        </div>

        <div className="border rounded-xl p-5 bg-gray-50">
          <p className="text-sm text-gray-500">Order Total</p>
          <p className="font-semibold text-lg">₦{order.total_amount}</p>
        </div>

        <div className="border rounded-xl p-5 bg-gray-50 sm:col-span-2">
          <p className="text-sm text-gray-500">Delivery Address</p>
          <p className="font-medium">{order.delivery_address}</p>
        </div>
      </div>

      {/* ITEMS */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Items in Your Order</h3>

        <div className="space-y-4">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border rounded-xl p-4 bg-white shadow-sm"
            >
              <img
                src={item.products?.images?.[0] || "/placeholder.png"}
                alt={item.products?.name}
                className="w-16 h-16 rounded-lg object-cover border"
              />

              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {item.products?.name}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">₦{item.price}</p>
                <p className="text-xs text-gray-500">
                  ₦{item.price} × {item.quantity}
                </p>
              </div>
            </div>
          ))}

          <div className="border rounded-lg p-4 mb-6 bg-white">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Estimated Delivery
            </p>

            <p className="text-base font-medium mt-1">{estimatedDelivery}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase mb-4">Order Timeline</h2>

        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-black mt-2" />
              <div>
                <p className="text-sm font-medium capitalize">{item.status}</p>
                <p className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
