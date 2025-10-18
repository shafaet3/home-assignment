import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const PartSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().positive("Stock must be greater than 0"),
  category: z.string().min(1, "Category is required"),
});

type PartInput = z.infer<typeof PartSchema>;

export default function PartForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<PartInput> & { imageUrl?: string };
  onSubmit: (data: FormData) => void | Promise<void>;
  onCancel?: () => void;
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

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // When editing, set the preview to current image
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);           // populate text fields
      setPreview(defaultValues.imageUrl || null); // show current image
      setFile(null);                  // keep file input empty
    } else {
      reset({ name: "", brand: "", price: 1, stock: 1, category: "" });
      setPreview(null);
      setFile(null);
    }
  }, [defaultValues, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected)); // update preview
    }
  };


  const handleFormSubmit = async (data: PartInput) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (file) {
      // New image uploaded
      formData.append("image", file);
    } else if (defaultValues?.imageUrl) {
      // Keep existing image if no new file selected
      formData.append("existingImageUrl", defaultValues.imageUrl);
    }

    await onSubmit(formData);

    // Reset form & preview after submission
    reset();
    setPreview(null);
    setFile(null);
  };

  const handleCancel = () => {
    reset();
    setPreview(null);
    setFile(null);
    if (onCancel) onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 bg-white p-4 rounded-xl shadow-md"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800 text-shadow-md">
        {defaultValues ? "Edit Part" : "Add Part"}
      </h3>

      {/* Text inputs */}
      {["name", "brand", "category"].map((f) => (
        <div key={f}>
          <label className="block text-base font-semibold text-gray-700 mb-1 capitalize">
            {f} *
          </label>
          <input
            {...register(f as keyof PartInput)}
            className={`w-full border p-2 rounded ${errors[f as keyof PartInput] ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors[f as keyof PartInput] && (
            <p className="text-red-600 text-sm mt-1">
              {errors[f as keyof PartInput]?.message as string}
            </p>
          )}
        </div>
      ))}

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-1">
            Price ($) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className={`w-full border p-2 rounded ${errors.price ? "border-red-500" : "border-gray-300"
              }`}
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-700 mb-1">
            Stock *
          </label>
          <input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            className={`w-full border p-2 rounded ${errors.stock ? "border-red-500" : "border-gray-300"
              }`}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
        {preview && (
          <img
            src={
              file
                ? preview // object URL for new file
                : `${process.env.NEXT_PUBLIC_API_BASE?.replace("/api", "")}${preview}` // existing image from backend
            }
            alt="preview"
            className="mt-2 w-32 h-32 object-cover rounded-lg border"
          />
        )}

      </div>

      {/* Submit & Cancel */}
      <div className="flex space-x-2">
        <button
          type="submit"
          className={`${defaultValues
            ? "bg-gradient-to-r from-green-400 to-emerald-500"
            : "bg-gradient-to-r from-blue-400 to-indigo-500"
            } text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all`}
        >
          {defaultValues ? "Update" : "Add"}
        </button>

        {defaultValues && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
