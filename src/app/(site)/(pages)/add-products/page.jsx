"use client";
import React, { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    productImage: null,
    productTitle: "Cotton_60_60 || Cotset",
    price: "525",
    mrp: "650",
    description:
      "Full interlock, Pent pocket, Limeted stock, Order for available, Radhe Krishna Creation jaipuri",
    inStock: "true",
  });
  const [Loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "productImage") {
      setFormData({ ...formData, productImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productImage)
      newErrors.productImage = "Product image is required";
    if (!formData.productTitle.trim())
      newErrors.productTitle = "Product title is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (formData.price && formData.price <= 0)
      newErrors.price = "Price must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    
    e.preventDefault();
    if (!validateForm()) return;

    setLoader(true);

    console.log(process.env.MONGODB_URI);
    const data = new FormData();
    data.append("productImage", formData.productImage);
    data.append("name", formData.productTitle);
    data.append("mrp", formData.mrp);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("inStock", formData.inStock);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          productImage: null,
          productImage: "",
          // productTitle: "",
          // price: "",
          // description: "",
          // inStock: "true",
        });
      } else {
        alert("❌ Failed to add product");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Something went wrong!");
    } finally {
      setLoader(false);
    }
  };

  return (
    <section className="overflow-hidden py-20 bg-gray-2 mt-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mt-9">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-10"
          >
            <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
              Add Product
            </h2>

            {/* Product Image */}
            <div className="mb-5">
              <label htmlFor="productImage" className="block mb-2.5">
                Upload Product Image
              </label>
              <input
                type="file"
                name="productImage"
                id="productImage"
                onChange={handleChange}
                className="w-full text-dark text-sm"
              />
              {errors.productImage && (
                <p className="text-red text-sm">{errors.productImage}</p>
              )}
              {formData.productImage && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(formData.productImage)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            {/* Product Title */}
            <div className="mb-5">
              <label htmlFor="productTitle" className="block mb-2.5">
                Product Title <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="productTitle"
                id="productTitle"
                value={formData.productTitle}
                onChange={handleChange}
                placeholder="Enter product title"
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none"
              />
              {errors.productTitle && (
                <p className="text-red text-sm">{errors.productTitle}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex gap-5 mb-5 flex-col sm:flex-row">
              <div className="w-full">
                <label htmlFor="mrp" className="block mb-2.5">
                  MRP <span className="text-red">*</span>
                </label>
                <input
                  type="number"
                  name="mrp"
                  id="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  placeholder="Enter product MRP"
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none"
                />
                {errors.mrp && <p className="text-red text-sm">{errors.mrp}</p>}
              </div>

              <div className="w-full">
                <label htmlFor="price" className="block mb-2.5">
                  Price <span className="text-red">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter product price"
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none"
                />
                {errors.price && (
                  <p className="text-red text-sm">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label htmlFor="description" className="block mb-2.5">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write product description..."
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none"
              ></textarea>
            </div>

            {/* In Stock */}
            <div className="mb-5">
              <label htmlFor="inStock" className="block mb-2.5">
                In Stock
              </label>
              <select
                name="inStock"
                id="inStock"
                value={formData.inStock}
                onChange={handleChange}
                className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark-4 py-3 pl-5 pr-9 outline-none"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={Loader}
                className="px-6 py-2 bg-blue text-white rounded-md hover:bg-blue-600 transition"
              >
                {!Loader ? "Save Product" : "Uploading Product..."}
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    productImage: null,
                    productTitle: "",
                    price: "",
                    description: "",
                    inStock: "true",
                  })
                }
                className="px-6 py-2 bg-gray-3 text-dark rounded-md hover:bg-gray-4 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Success Modal */}
          {success && (
            <div className="bg-dark fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white p-6 rounded-md shadow-lg text-center">
                <h3 className="text-xl font-semibold mb-3">✅ Product Added</h3>
                <p className="text-dark mb-5">
                  Your product has been successfully added!
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 bg-blue text-white rounded-md hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
