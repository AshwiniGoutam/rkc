"use client";
import React, { useState } from "react";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    inStock: true,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("price", formData.price);
    fd.append("inStock", String(formData.inStock));
    if (file) fd.append("file", file);

    const res = await fetch("/api/products", {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      alert("✅ Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        inStock: true,
      });
      setFile(null);
    } else {
      alert("❌ Failed to add product");
    }
  };

  return (
    <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 mt-50">
      <h2 className="font-medium text-dark text-2xl mb-6">Add Product</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[10px] flex flex-col gap-5"
        encType="multipart/form-data"
      >
        {/* Product Name */}
        <div>
          <label className="block mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="iPhone 16"
            required
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2">Upload Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2">Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="1000"
            required
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description..."
            required
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

        {/* In Stock */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label>In Stock</label>
        </div>

        <button
          type="submit"
          className="inline-flex w-40 font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
