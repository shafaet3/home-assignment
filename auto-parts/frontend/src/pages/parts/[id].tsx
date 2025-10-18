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
    <div className="max-w-3xl mx-auto mt-10 flex flex-col md:flex-row gap-6 rounded-2xl shadow-lg overflow-hidden">
      {/* Image Section with Gradient */}
      <div
        className={`flex-shrink-0 w-full md:w-1/3 bg-gradient-to-br ${gradients[part.id % gradients.length]
          } p-4 flex items-center justify-center`}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_API_BASE?.replace("/api", "")}${part.imageUrl}`}
          alt={part.name}
          className="w-full h-64 object-cover rounded-xl shadow-md border border-white/30"
        />
      </div>

      {/* Info Section */}
      <div className="flex-1 bg-white p-6 flex flex-col justify-between rounded-r-2xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{part.name}</h1>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Brand:</span> {part.brand || "-"}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Category:</span> {part.category || "-"}
          </p>
          <p className="text-gray-800 text-2xl font-semibold mb-1">
            ${part.price}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Stock:</span> {part.stock}
          </p>
        </div>

        <div className="text-gray-500 text-sm mt-4">
          Created: {part.createdAt ? new Date(part.createdAt).toLocaleString() : "-"}
        </div>
      </div>
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
