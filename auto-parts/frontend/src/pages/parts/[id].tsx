import { GetStaticPaths, GetStaticProps } from "next";

type Part = {
  id: number;
  name: string;
  brand?: string;
  price: string | number;
  stock: number;
  category?: string;
  createdAt?: string;
};

// 🌈 Gradient colors
const gradients = [
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
];

export default function PartPage({ part }: { part: Part | null }) {
  if (!part) return <div>Part not found</div>;

  // Pick a gradient based on ID for consistency
  const gradient = gradients[part.id % gradients.length];

  return (
    <div
      className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-lg text-white max-w-md mx-auto mt-10`}
    >
      <h1 className="text-3xl font-bold mb-2">{part.name}</h1>
      <p className="text-sm opacity-90 mb-2">Brand: {part.brand || "-"}</p>
      <p className="mb-2 opacity-90">Category: {part.category || "-"}</p>
      <p className="text-2xl font-semibold mb-2">${part.price}</p>
      <p className="text-sm opacity-90">Stock: {part.stock}</p>
      <p className="text-xs opacity-70 mt-4">
        Created: {part.createdAt ? new Date(part.createdAt).toLocaleString() : "-"}
      </p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/parts`);
  const parts = await res.json();
  const paths = (parts || []).slice(0, 50).map((p: any) => ({
    params: { id: String(p.id) },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/parts/${id}`);
  if (!res.ok) return { notFound: true };
  const part = await res.json();
  return { props: { part }, revalidate: 3600 };
};
