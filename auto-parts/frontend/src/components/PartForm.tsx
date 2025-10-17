import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const PartSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().optional(),
  price: z.number().nonnegative("Price must be >= 0"),
  stock: z.number().int().nonnegative("Stock must be >= 0"),
  category: z.string().optional(),
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
      price: 0,
      stock: 0,
      category: "",
    },
  });

  // Reset form whenever defaultValues change (for Edit)
  useEffect(() => {
    reset(defaultValues || {
      name: "",
      brand: "",
      price: 0,
      stock: 0,
      category: "",
    });
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data: PartInput) => {
    await onSubmit(data);
    reset(defaultValues ? defaultValues : { name: "", brand: "", price: 0, stock: 0, category: "" }); 
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-3 bg-white p-4 rounded-xl shadow-md"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input {...register("name")} className="w-full border border-gray-300 p-2 rounded" />
        {errors.name && <div className="text-sm text-red-600">{errors.name.message}</div>}
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
        <input {...register("brand")} className="w-full border border-gray-300 p-2 rounded" />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
        <input
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          className="w-full border border-gray-300 p-2 rounded"
        />
        {errors.price && <div className="text-sm text-red-600">{errors.price.message}</div>}
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
        <input
          type="number"
          {...register("stock", { valueAsNumber: true })}
          className="w-full border border-gray-300 p-2 rounded"
        />
        {errors.stock && <div className="text-sm text-red-600">{errors.stock.message}</div>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <input {...register("category")} className="w-full border border-gray-300 p-2 rounded" />
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
