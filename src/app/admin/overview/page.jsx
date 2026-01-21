"use client";
import LoadingSpinner from "@/utils/loadingSpinner";
import { useEffect, useState } from "react";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/overview")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    {
      label: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
    },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Pending Orders", value: stats.pendingOrders },
    { label: "Low Stock Alerts", value: stats.lowStock },
  ];

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Dashboard Overview
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border bg-white p-5 shadow-sm transition
                       hover:shadow-md hover:-translate-y-1"
          >
            <p className="text-sm text-gray-500">{card.label}</p>

            <p className="mt-3 text-2xl font-bold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
