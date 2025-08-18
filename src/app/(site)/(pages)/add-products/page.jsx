"use client"
import React, { useState } from 'react'

export default function Page() {
    const [formData, setFormData] = useState({
        productImage: null,
        productTitle: "",
        price: "",
        description: "",
        inStock: "true"
    })

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === "productImage") {
            setFormData({ ...formData, productImage: files[0] })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = new FormData();
        data.append("productImage", formData.productImage); // name matches server
        data.append("name", formData.productTitle);
        data.append("price", formData.price);
        data.append("description", formData.description);


        try {
            const res = await fetch("/api/products", {
                method: "POST",
                body: data
            })

            if (res.ok) {
                alert("✅ Product added successfully!")
                setFormData({
                    productImage: null,
                    productTitle: "",
                    price: "",
                    description: "",
                    inStock: "true"
                })
            } else {
                alert("❌ Failed to add product")
            }
        } catch (error) {
            console.error(error)
            alert("⚠️ Something went wrong!")
        }
    }

    return (
        <section className="overflow-hidden py-20 bg-gray-2 mt-20">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                <div className="mt-9">
                    <form onSubmit={handleSubmit} className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-10">
                        <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
                            Add Product
                        </h2>

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
                        </div>

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
                                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                            />
                        </div>

                        <div className="mb-5">
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
                                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                            />
                        </div>

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
                                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                            ></textarea>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="inStock" className="block mb-2.5">
                                In Stock
                            </label>
                            <select
                                name="inStock"
                                id="inStock"
                                value={formData.inStock}
                                onChange={handleChange}
                                className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark-4 py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-6">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue text-white rounded-md hover:bg-blue-600 transition"
                            >
                                Save Product
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({
                                    productImage: null,
                                    productTitle: "",
                                    price: "",
                                    description: "",
                                    inStock: "true"
                                })}
                                className="px-6 py-2 bg-gray-3 text-dark rounded-md hover:bg-gray-4 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
