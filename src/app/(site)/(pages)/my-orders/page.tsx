"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import React, { useEffect, useState } from "react";

interface Product {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  img_url?: string;
  color?: string;
  size?: string;
}

interface Order {
  _id: string;
  name: string;
  streetAddress: string;
  phone: string;
  email: string;
  products: Product[];
  totalPrice: number;
  createdAt: string;
  status?: "current" | "shipped" | "delivered" | "unpaid";
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case "current":
      return {
        text: "On the way",
        bg: "bg-orange-100",
        textColor: "text-orange-800",
      };
    case "shipped":
      return {
        text: "Shipped",
        bg: "bg-green-100",
        textColor: "text-green-800",
      };
    case "delivered":
      return {
        text: "Delivered",
        bg: "bg-blue-100",
        textColor: "text-blue-800",
      };
    case "unpaid":
      return { text: "Unpaid", bg: "bg-red-100", textColor: "text-red-800" };
    default:
      return {
        text: "Processing",
        bg: "bg-gray-100",
        textColor: "text-gray-800",
      };
  }
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"current" | "unpaid" | "all">(
    "all"
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/checkout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading orders...</p>;
  if (!orders.length)
    return <p className="text-center text-lg py-10 text-gray-500 mt-60">No orders found.</p>;

  return (
    <>
      <Breadcrumb title="My Orders" pages={["my-orders"]} />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Orders */}
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const status = getStatusInfo(order.status || "current");

              return (
                <div
                  key={order._id}
                  className="bg-white shadow-md rounded-xl p-6 border border-[#ccc]"
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Order ID: {order._id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {order.products.length} Products | By {order.name} |{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`${status.bg} ${status.textColor} text-sm font-medium px-3 py-1 rounded-full mt-2 md:mt-0`}
                    >
                      {status.text}
                    </span>
                  </div>

                  {/* Billing Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Name:</span> {order.name}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Phone:</span>{" "}
                        {order.phone}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        {order.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Address:</span>{" "}
                        {order.streetAddress}
                      </p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.products.map((product) => (
                      <div
                        key={product.productId}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={product.img_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-1">
                            Quantity: {product.quantity} x ₹ {product.price} = ₹{" "}
                            {product.totalPrice}
                          </p>
                          {product.color && (
                            <p className="text-xs text-gray-500">
                              Color: {product.color}
                            </p>
                          )}
                          {product.size && (
                            <p className="text-xs text-gray-500">
                              Size: {product.size}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-end mt-4">
                    <div className="text-lg font-semibold text-gray-800">
                      Total: ₹ {order.totalPrice}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
