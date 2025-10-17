// src/pages/dashboard.tsx
import { useEffect, useState } from "react";
import PartForm from "@/components/PartForm";
import { api } from "@/lib/api";
import { isLoggedIn, logout } from "@/utils/auth";
import { useRouter } from "next/router";

type Part = {
  id: number;
  name: string;
  brand?: string;
  price: number;
  stock: number;
  category?: string;
};

// Gradient options for colorful rows
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
      const data = await api("/parts");
      setParts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createPart(v: any) {
    try {
      const created = await api("/parts", { method: "POST", data: v });
      setParts((p) => [created, ...p]);
    } catch (err: any) {
      alert(err.data?.message || "Create failed");
    }
  }

  async function updatePart(v: any) {
    if (!editing) return;
    try {
      const updated = await api(`/parts/${editing.id}`, { method: "PUT", data: v });
      setParts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
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
    } catch {
      alert("Delete failed");
    }
  }

  const totalParts = parts.length;
  const categories = Array.from(new Set(parts.map((p) => p.category || "Uncategorized"))).length;

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="space-x-2">
            {/* <span className="text-sm text-gray-600">{user?.name}</span> */}
            {/* <button onClick={handleLogout} className="text-sm text-red-600">
              Logout
            </button> */}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-semibold mb-2">Parts</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-3">
              <ul className="space-y-3">
                {parts.map((p) => {
                  const gradient = gradients[p.id % gradients.length];
                  return (
                    <li
                      key={p.id}
                      className={`flex justify-between items-center p-4 rounded shadow text-white bg-gradient-to-r ${gradient}`}
                    >
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm opacity-90">
                          ${p.price} • stock: {p.stock}
                        </div>
                      </div>
                      <div className="space-x-2 flex">
                        <button
                          className="bg-white bg-opacity-80 text-gray-800 px-3 py-1 rounded hover:bg-opacity-100 transition"
                          onClick={() => setEditing(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 bg-opacity-80 text-white px-3 py-1 rounded hover:bg-opacity-100 transition"
                          onClick={() => deletePart(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

            </ul>
          )}
        </div>
      </div>

      <aside className="bg-white p-4 rounded shadow">
        <div className="mb-4">
          <strong>Total parts:</strong> {totalParts}
          <br />
          <strong>Categories:</strong> {categories}
        </div>

        <div>
          <h3
            className={`text-center font-bold mb-4 text-lg ${editing ? "text-yellow-600" : "text-green-600"
              } border-l-4 pl-3 py-1 ${editing ? "border-yellow-600 bg-yellow-50" : "border-green-600 bg-green-50"
              } rounded`}
          >
            {editing ? "Edit Part" : "Add Part"}
          </h3>

          <PartForm
            defaultValues={editing || undefined}
            onSubmit={editing ? updatePart : createPart}
          />
          {editing && (
            <button
              className="mt-2 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
              onClick={() => setEditing(null)}
            >
              Cancel Edit
            </button>
          )}

        </div>
      </aside>
    </div>
  );
}
