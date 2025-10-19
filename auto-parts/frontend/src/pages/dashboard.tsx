// src/pages/dashboard.tsx
import { useEffect, useState } from "react";
import PartForm from "@/components/PartForm";
import { api } from "@/lib/api";
import { isLoggedIn, logout } from "@/utils/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import AnalyticsBar from "@/components/AnalyticsBar";

type Part = {
  id: number;
  name: string;
  brand: string | null;
  price: number;
  stock: number;
  category: string | null;
  imageUrl?: string | null;
  createdAt: Date;
};


// Gradient colors for card backgrounds
const gradients = [
  "from-blue-400 to-indigo-500",
  "from-green-400 to-emerald-500",
  "from-pink-400 to-rose-500",
  "from-yellow-400 to-orange-500",
  "from-purple-400 to-fuchsia-500",
  "from-cyan-400 to-sky-500",
  "from-teal-400 to-lime-500",
  "from-amber-400 to-pink-500",
  "from-violet-400 to-cyan-500",
  "from-red-400 to-yellow-500",
];

export default function Dashboard() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Part | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const r = await isLoggedIn();
      if (!r?.user) {
        router.push("/login");
        return;
      }
      setUser(r.user);
      await fetchParts();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchParts() {
    setLoading(true);
    try {
      const data = await api<Part[]>("/parts");
      setParts(data);
    } catch (err) {
      console.error("Failed to fetch parts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createPart(formData: FormData) {
    try {
      const created = await api<Part>("/parts", {
        method: "POST",
        data: formData,
      });
      setParts((prev) => [created, ...prev]);
    } catch (err: any) {
      alert(err.data?.message || "Create failed");
    }
  }

  async function updatePart(formData: FormData) {
    if (!editing) return;
    try {
      const updated = await api<Part>(`/parts/${editing.id}`, {
        method: "PUT",
        data: formData,
      });
      setParts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditing(null);
    } catch (err: any) {
      alert(err.data?.message || "Update failed");
    }
  }

  async function deletePart(id: number) {
    if (!confirm("Delete this part?")) return;
    try {
      await api(`/parts/${id}`, { method: "DELETE" });
      setParts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  }

  const totalParts = parts.length;
  const categories = Array.from(
    new Set(parts.map((p) => p.category || "Uncategorized"))
  ).length;

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 rounded-lg shadow-md mb-6 tracking-wide">
        Parts Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Parts List */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-xl shadow mb-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul className="space-y-3">
                {parts.map((p) => {
                  const gradient = gradients[p.id % gradients.length];
                  return (
                    <li
                      key={p.id}
                      className={`flex justify-between items-center p-4 rounded-xl shadow text-white bg-gradient-to-r ${gradient}`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            p.imageUrl
                              ? `${process.env.NEXT_PUBLIC_API_BASE?.replace(
                                "/api",
                                ""
                              )}${p.imageUrl}`
                              : "https://placehold.co/60x60/e2e8f0/94a3b8?text=📷"
                          }
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-md border border-white/40 bg-white/20"
                        />

                        <div>
                          <div className="text-2xl font-bold drop-shadow-md mb-1">
                            {p.name}
                          </div>
                          <div className="text-base text-white drop-shadow-sm mb-1">
                            <span className="font-semibold">Price:</span> ${p.price}
                          </div>
                          <div className="text-base text-white drop-shadow-sm">
                            <span className="font-semibold">Stock:</span> {p.stock}
                          </div>
                        </div>
                      </div>

                      <div className="space-x-2 flex">
                        {/* View */}
                        <Link
                          href={`/parts/${p.id}`}
                          className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-3 py-1 rounded-lg border border-blue-600 hover:from-indigo-500 hover:to-blue-600 hover:shadow-lg transition-all duration-300"
                        >
                          View
                        </Link>

                        {/* Edit */}
                        <button
                          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-lg border border-green-600 hover:from-emerald-500 hover:to-green-400 hover:shadow-lg transition-all duration-300"
                          onClick={() => setEditing(p)}
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          className="bg-gradient-to-r from-red-400 to-yellow-500 text-white px-3 py-1 rounded-lg border border-red-600 hover:from-red-500 hover:to-yellow-600 hover:shadow-lg transition-all duration-300"
                          onClick={() => deletePart(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="bg-white p-4 rounded-xl shadow">
          <AnalyticsBar totalParts={totalParts} categories={categories} />

          <div>
            <h3
              className={`text-center font-bold mb-4 text-lg text-white border-l-4 pl-3 py-1 ${editing
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-gradient-to-r from-blue-400 to-indigo-500"
                } rounded`}
            >
              {editing ? "Edit Part" : "Add Part"}
            </h3>

            <PartForm
              defaultValues={
                editing
                  ? {
                    ...editing,
                    brand: editing.brand ?? undefined,
                    category: editing.category ?? undefined,
                    imageUrl: editing.imageUrl ?? undefined,
                  }
                  : undefined
              }
              onSubmit={editing ? updatePart : createPart}
              onCancel={() => setEditing(null)}
            />



          </div>
        </aside>
      </div>
    </>
  );
}
