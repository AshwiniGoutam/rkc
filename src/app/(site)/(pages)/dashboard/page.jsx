"use client";
import useSWR from "swr";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const {
    data: products,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/products", fetcher, { refreshInterval: 5000 });

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Failed to load products</p>;

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

        if (res.ok) {
          Swal.fire("Deleted!", "Product has been removed.", "success");
          mutate(); // 🔄 refresh product list
        } else {
          Swal.fire("Error!", "Failed to delete product.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <section className="bg-gray mt-50">
      <div className="max-w-7xl py-10 pb-20 mx-auto px-0 sm:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-2xl text-gray-800 mb-0 p-0">
            Products
          </h2>
          <Link
            href="/add-products"
            className="w-auto flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
          >
            Add Product
          </Link>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-left border-b border-gray">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products?.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b last:border-none hover:bg-gray-50 border-gray"
                  >
                    <td className="p-4">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      {/* <p className="text-gray-500 text-sm">{item.description}</p> */}
                    </td>
                    <td className="p-4 font-semibold text-gray-700">
                      ₹{item.price}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          item.inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {/* ✅ Edit (navigate to edit page with ID) */}
                      {/* <Link
                      href={`/edit-product/${item._id}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      <Pencil size={16} className="mr-1" /> Edit
                    </Link> */}

                      {/* ✅ Delete (with swal confirm) */}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No products found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
