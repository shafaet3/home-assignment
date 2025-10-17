import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schema: all required, price & stock > 0
const PartSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be an integer")
    .positive("Stock must be greater than 0"),
  category: z.string().min(1, "Category is required"),
});

type PartInput = z.infer<typeof PartSchema>;

export default function PartForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<PartInput>;
  onSubmit: (data: PartInput) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartInput>({
    resolver: zodResolver(PartSchema),
    defaultValues: defaultValues || {
      name: "",
      brand: "",
      price: 1,
      stock: 1,
      category: "",
    },
  });

  // Reset form when defaultValues change (for Edit)
  useEffect(() => {
    reset(defaultValues || { name: "", brand: "", price: 1, stock: 1, category: "" });
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data: PartInput) => {
    await onSubmit(data);
    reset(defaultValues ? defaultValues : { name: "", brand: "", price: 1, stock: 1, category: "" });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 bg-white p-4 rounded-xl shadow-md"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          {...register("name")}
          className={`w-full border p-2 rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
        <input
          {...register("brand")}
          className={`w-full border p-2 rounded ${errors.brand ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand.message}</p>}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
        <input
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          className={`w-full border p-2 rounded ${errors.price ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
        <input
          type="number"
          {...register("stock", { valueAsNumber: true })}
          className={`w-full border p-2 rounded ${errors.stock ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <input
          {...register("category")}
          className={`w-full border p-2 rounded ${errors.category ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
}
