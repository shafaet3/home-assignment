// src/components/PartCard.tsx
import Link from "next/link";

export default function PartCard({ part }: any) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold">{part.name}</h3>
      <p className="text-sm text-gray-500">{part.brand || "-"}</p>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-blue-600 font-bold">${part.price}</div>
          <div className="text-sm text-gray-600">Stock: {part.stock}</div>
        </div>
        <Link href={`/parts/${part.id}`} className="text-sm text-white bg-brand-500 px-3 py-1 rounded">
          View</Link>
      </div>
    </div>
  );
}
