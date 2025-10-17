import { Boxes, Layers, Activity, BarChart3 } from "lucide-react";

export default function AnalyticsBar({ totalParts, categories }: { totalParts: number; categories: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      {/* Total Parts */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Boxes className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold tracking-wide">Total Parts</h3>
          </div>
          <Activity className="w-6 h-6 text-white/70" />
        </div>

        <div className="text-5xl font-extrabold drop-shadow-lg mb-3">{totalParts}</div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/80 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(totalParts / 2, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold tracking-wide">Categories</h3>
          </div>
          <BarChart3 className="w-6 h-6 text-white/70" />
        </div>

        <div className="text-5xl font-extrabold drop-shadow-lg mb-3">{categories}</div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/80 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(categories * 5, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
