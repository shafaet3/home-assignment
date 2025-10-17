// src/pages/login.tsx
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { login } from "@/utils/auth";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  async function onSubmit(data: any) {
    try {
      await login(data.email, data.password);
      // server sets httpOnly cookie — now redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.data?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("email")} placeholder="Email" className="w-full border p-2 rounded" />
        <input {...register("password")} type="password" placeholder="Password" className="w-full border p-2 rounded" />
        <div><button className="w-full bg-blue-600 text-white py-2 rounded">Login</button></div>
      </form>
    </div>
  );
}
