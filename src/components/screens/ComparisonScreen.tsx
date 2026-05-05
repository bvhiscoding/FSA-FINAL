"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  GitCompare,
  Plus,
  AlertCircle,
  FileText,
} from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";

const comparisonData = [
  { name: "Doanh thu", "DHT 2024": 2847, "DHT 2023": 2631 },
  { name: "LN Gộp", "DHT 2024": 680, "DHT 2023": 708 },
  { name: "Chi phí G&A", "DHT 2024": 312, "DHT 2023": 198 },
  { name: "EBIT", "DHT 2024": 228, "DHT 2023": 374 },
  { name: "LN Ròng", "DHT 2024": 187, "DHT 2023": 244 },
];

const radarData = [
  { subject: "Thanh khoản", "DHT 2024": 40, "DHT 2023": 80 },
  { subject: "Sinh lời", "DHT 2024": 60, "DHT 2023": 75 },
  { subject: "Đòn bẩy", "DHT 2024": 50, "DHT 2023": 30 },
  { subject: "Hiệu quả", "DHT 2024": 70, "DHT 2023": 75 },
  { subject: "Tăng trưởng", "DHT 2024": 55, "DHT 2023": 65 },
];

const mockComparisonMetrics = [
  { label: "Doanh thu thuần", v1: "2,847 tỷ", v2: "2,631 tỷ", change: 8.2 },
  { label: "Lợi nhuận ròng", v1: "187 tỷ", v2: "244 tỷ", change: -23.4 },
  { label: "Biên LN gộp", v1: "23.9%", v2: "26.9%", change: -3.0 },
  { label: "ROE", v1: "8.7%", v2: "12.0%", change: -3.3 },
  { label: "D/E ratio", v1: "0.79x", v2: "0.54x", change: 46.3 },
  { label: "Current Ratio", v1: "1.82x", v2: "2.34x", change: -22.2 },
];

export function ComparisonScreen() {
  const [mode, setMode] = useState<"yoy" | "peer">("yoy");

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-sm font-semibold text-slate-800">
              Comparison Analysis
            </h1>
            <p className="text-[11px] text-slate-400">
              So sánh đa kỳ và đối thủ cùng ngành
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg cursor-pointer transition-colors bg-blue-600 hover:bg-blue-700">
            <Plus size={14} /> New Comparison
          </button>
        </div>

        {/* Mode & Selectors */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg w-max">
            <button
              onClick={() => setMode("yoy")}
              className={cn(
                "px-3 py-1.5 rounded-md text-[12px] font-medium transition-all cursor-pointer",
                mode === "yoy"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Year over Year (YoY)
            </button>
            <button
              onClick={() => setMode("peer")}
              className={cn(
                "px-3 py-1.5 rounded-md text-[12px] font-medium transition-all cursor-pointer",
                mode === "peer"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Peer Comparison
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 shadow-sm text-blue-700 rounded-lg text-sm font-medium">
              DHT 2024
            </div>
            <span className="text-slate-300 font-bold px-1">VS</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium">
              DHT 2023
            </div>
            {mode === "peer" && (
              <>
                <span className="text-slate-300 font-bold px-1">VS</span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium">
                  TRA 2024
                </div>
              </>
            )}
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 border-dashed text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-sm transition-colors cursor-pointer ml-2">
              <Plus size={14} /> Thêm
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-6xl mx-auto w-full">
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-4">
            <h2 className="text-[13px] font-semibold text-slate-700 mb-4">
              Radar Khung Rủi Ro & Hiệu Quả
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <Radar
                  name="DHT 2024"
                  dataKey="DHT 2024"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.4}
                />
                <Radar
                  name="DHT 2023"
                  dataKey="DHT 2023"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.3}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-4">
            <h2 className="text-[13px] font-semibold text-slate-700 mb-4">
              So sánh Kết Quả Kinh Doanh (Tỷ VND)
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="DHT 2024" fill="#2563eb" radius={[2, 2, 0, 0]} maxBarSize={40} />
                <Bar dataKey="DHT 2023" fill="#94a3b8" radius={[2, 2, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h2 className="text-[12px] font-semibold text-slate-600 uppercase tracking-wide">
              Bảng So Sánh Chỉ Tiêu
            </h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="py-2.5 pl-4 pr-2 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-2/5">
                  Chỉ tiêu
                </th>
                <th className="py-2.5 px-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-blue-600 bg-blue-50/50">
                  DHT 2024
                </th>
                <th className="py-2.5 px-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  DHT 2023
                </th>
                <th className="py-2.5 pl-3 pr-4 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Delta (YoY)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {mockComparisonMetrics.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pl-4 pr-2 text-[13px] font-medium text-slate-700">
                    {m.label}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-[13px] font-semibold text-slate-800 bg-blue-50/20">
                    {m.v1}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-[13px] text-slate-500">
                    {m.v2}
                  </td>
                  <td className="py-3 pl-3 pr-4 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 text-[12px] font-semibold",
                        m.change > 0
                          ? "text-emerald-600"
                          : m.change < 0
                          ? "text-red-600"
                          : "text-slate-400"
                      )}
                    >
                      {m.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {Math.abs(m.change)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Insight Panel */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0">
              <GitCompare size={12} />
            </div>
            <h2 className="text-sm font-bold text-slate-800">
              AI Comparison Insights
            </h2>
          </div>
          <div className="space-y-3 text-[13px] text-slate-700 leading-relaxed">
            <p>
              <span className="font-semibold text-blue-700">Tăng trưởng top-line đi kèm suy giảm sinh lời:</span>{" "}
              Dù doanh thu tăng trưởng 8.2%, lợi nhuận ròng lại suy giảm mạnh 23.4% so với 2023. Biên lợi nhuận gộp thu hẹp từ 26.9% xuống 23.9% cho thấy sức ép lớn từ giá vốn.
            </p>
            <p>
              <span className="font-semibold text-amber-600">Rủi ro đòn bẩy và thanh khoản:</span>{" "}
              D/E ratio tăng đáng kể từ 0.54x lên 0.79x, trong khi Current Ratio giảm từ 2.34x xuống 1.82x, phản ánh gánh nặng nợ vay ngắn hạn để tài trợ dự án xây dựng cơ bản dở dang (CIP).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
