import React, { ChangeEvent } from "react";

interface BillingData {
  name: string;
  streetAddress: string;
  phone: string;
  email: string;
}

interface BillingProps {
  billingData: BillingData;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors?: Partial<BillingData>; // ✅ correct way
}

const Billing: React.FC<BillingProps> = ({
  billingData,
  handleChange,
  errors,
}) => {
  return (
    <div className="mt-0">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        Billing details
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        {/* Name */}
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2.5">
            Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="John"
            value={billingData.name}
            onChange={handleChange}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors?.name && (
            <p className="text-red mt-2 text-sm">{errors.name}</p>
          )}
        </div>

        {/* Street Address */}
        <div className="mb-5">
          <label htmlFor="streetAddress" className="block mb-2.5">
            Street Address <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="streetAddress"
            id="streetAddress"
            placeholder="House number and street name"
            value={billingData.streetAddress}
            onChange={handleChange}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors?.streetAddress && (
            <p className="text-red mt-2 text-sm">{errors.streetAddress}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            Phone <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={billingData.phone}
            onChange={handleChange}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors?.phone && (
            <p className="text-red mt-2 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5.5">
          <label htmlFor="email" className="block mb-2.5">
            Email Address <span className="text-red">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={billingData.email}
            onChange={handleChange}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors?.email && (
            <p className="text-red mt-2 text-sm">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
