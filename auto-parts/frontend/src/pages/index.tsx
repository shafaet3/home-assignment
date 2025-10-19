import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";

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


// 🌈 Extended colorful gradients
const colors = [
  "from-blue-500 to-indigo-500",
  "from-green-500 to-emerald-500",
  "from-pink-500 to-rose-500",
  "from-yellow-500 to-orange-500",
  "from-purple-500 to-fuchsia-500",
  "from-cyan-500 to-sky-500",
  "from-teal-500 to-lime-500",
  "from-amber-500 to-pink-500",
  "from-violet-500 to-cyan-500",
  "from-red-500 to-yellow-500",
  "from-emerald-500 to-blue-500",
  "from-rose-500 to-purple-500",
  "from-orange-500 to-red-500",
  "from-sky-500 to-blue-700",
  "from-lime-500 to-green-700",
];

export default function Home({ parts }: { parts: Part[] }) {
  const [query, setQuery] = useState("");
  const filtered = parts.filter((p) =>
    (p.name + " " + (p.brand || "") + " " + (p.category || "")).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">All Auto Parts (SSR)</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search by name, brand, category..."
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((p, index) => {
          const gradient = colors[index % colors.length];
          return (
            <div
              key={p.id}
              className={`rounded-xl shadow-lg p-5 text-white bg-gradient-to-br ${gradient} hover:scale-[1.03] transition-transform duration-300`}
            >
              <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
              <p className="text-sm opacity-90">{p.brand || "Unknown Brand"}</p>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold">${p.price}</div>
                  <div className="text-sm opacity-90">Stock: {p.stock}</div>
                </div>
                <Link
                  href={`/parts/${p.id}`}
                  className="text-sm bg-white text-gray-900 px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  View
                </Link>
              </div>

              {p.category && (
                <div className="mt-3 inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                  {p.category}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No parts found 🔧</div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.INTERNAL_API_BASE}/parts`);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const parts = await res.json();
  return { props: { parts } };
};
