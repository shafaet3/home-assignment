// src/pages/register.tsx
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { register as apiRegister } from "@/utils/auth";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  async function onSubmit(data: any) {
    try {
      await apiRegister(data.name, data.email, data.password);
      alert("Registered. Please login.");
      router.push("/login");
    } catch (err: any) {
      alert(err.data?.message || "Register failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("name")} placeholder="Name" className="w-full border p-2 rounded" />
        <input {...register("email")} placeholder="Email" className="w-full border p-2 rounded" />
        <input {...register("password")} type="password" placeholder="Password" className="w-full border p-2 rounded" />
        <div><button className="w-full bg-green-600 text-white py-2 rounded">Register</button></div>
      </form>
    </div>
  );
}
