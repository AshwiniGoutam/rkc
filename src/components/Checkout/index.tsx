"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";
import { useAppSelector } from "@/redux/store";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartItem {
  image_url: any;
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  img_url: string;
}

interface BillingData {
  name: string;
  streetAddress: string;
  phone: string;
  email: string;
}

interface OrderResponse {
  orderId: string;
  totalPrice: number;
}

const Checkout: React.FC = () => {
  const router = useRouter();
  const cartItems = useAppSelector(
    (state) => state.cartReducer.items
  ) as unknown as CartItem[];
  const totalPrice = useAppSelector(selectTotalPrice);

  const [billingData, setBillingData] = useState<BillingData>({
    name: "",
    streetAddress: "",
    phone: "",
    email: "",
  });

  const [successOrder, setSuccessOrder] = useState<OrderResponse | null>(null);
  const [loginRequired, setLoginRequired] = useState(false);

  const handleBillingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingData({ ...billingData, [name]: value });
  };

  const [errors, setErrors] = useState<Partial<BillingData>>({});

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<BillingData> = {};
    if (!billingData.name) newErrors.name = "Name is required";
    if (!billingData.streetAddress)
      newErrors.streetAddress = "Address is required";
    if (!billingData.email) newErrors.email = "Email is required";
    if (!billingData.phone) newErrors.phone = "Phone number is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // stop if errors exist
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setLoginRequired(true);
      return;
    }

    if (!billingData.name || !billingData.streetAddress || !billingData.email) {
      alert("Please fill all required fields");
      return;
    }

    if (!cartItems.length) {
      alert("Your cart is empty");
      return;
    }

    const products = cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      img_url: item.image_url,
      totalPrice: item.price * item.quantity,
    }));

    const orderTotal = products.reduce((sum, p) => sum + p.totalPrice, 0);

    const payload = { ...billingData, products, totalPrice: orderTotal };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 send token
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessOrder({ orderId: data.orderId, totalPrice: orderTotal });
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  const closeModal = () => {
    setSuccessOrder(null);
    router.push("/");
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      {loginRequired && (
        <div className="fixed inset-0 z-[99999999999] flex items-center justify-center bg-dark/70">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>
            <p className="mb-6">You must login before placing an order.</p>
            <Link
              href="/signin"
              className="bg-blue text-white px-6 py-2 rounded-md hover:bg-blue-dark transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}
      <section className="overflow-hidden py-10 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleCheckout}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              <div className="lg:max-w-[670px] w-full">
                <Billing
                  billingData={billingData}
                  handleChange={handleBillingChange}
                  errors={errors}
                />
              </div>

              <div className="max-w-[455px] w-full mt-14 h-100">
                <div className="bg-white shadow-1 rounded-[10px] sticky top-0">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <h4 className="font-medium text-dark">Product</h4>
                      <h4 className="font-medium text-dark text-right">
                        Subtotal
                      </h4>
                    </div>

                    {cartItems.map((item, index) => (
                      <div
                        className="flex items-center justify-between py-5 border-b border-gray-3"
                        key={index}
                      >
                        <p className="text-dark">{item.name}</p>
                        <p className="text-dark text-right">
                          ₹ {item.price * item.quantity}
                        </p>
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-5">
                      <p className="font-medium text-lg text-dark">Total</p>
                      <p className="font-medium text-lg text-dark text-right">
                        ₹ {totalPrice}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  Process to Checkout
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
      {/* Success Modal */}
      {successOrder && (
        <div className="fixed inset-0 z-[99999999999] flex items-center justify-center bg-dark bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative mx-4">
            <button
              onClick={() => closeModal()}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="text-center">
              <svg
                className="mx-auto mb-4 w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <h2 className="text-2xl font-semibold mb-2">
                Order Placed Successfully!
              </h2>
              <p className="mb-2">
                Order ID: <strong>{successOrder.orderId}</strong>
              </p>
              <p className="mb-4">
                Total Amount: <strong>₹ {successOrder.totalPrice}</strong>
              </p>
              <button
                onClick={() => closeModal()}
                className="bg-blue text-white px-6 py-2 rounded-md hover:bg-blue-dark transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
