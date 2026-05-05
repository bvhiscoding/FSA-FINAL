"use client";

import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  FileText,
  Zap,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useAppStore } from "@/store/appStore";

const revenueData = [
  { q: "Q1'23", revenue: 627, profit: 68 },
  { q: "Q2'23", revenue: 648, profit: 72 },
  { q: "Q3'23", revenue: 671, profit: 60 },
  { q: "Q4'23", revenue: 685, profit: 44 },
  { q: "Q1'24", revenue: 682, profit: 54 },
  { q: "Q2'24", revenue: 708, profit: 48 },
  { q: "Q3'24", revenue: 721, profit: 44 },
  { q: "Q4'24", revenue: 736, profit: 41 },
];

const marginData = [
  { year: "2020", gross: 28.4, ebit: 15.2, net: 11.8 },
  { year: "2021", gross: 27.1, ebit: 13.8, net: 10.4 },
  { year: "2022", gross: 26.3, ebit: 14.6, net: 11.2 },
  { year: "2023", gross: 26.9, ebit: 14.2, net: 9.3 },
  { year: "2024", gross: 23.9, ebit: 8.0, net: 6.6 },
];

const cashData = [
  { q: "Q4'23", cash: 432 },
  { q: "Q1'24", cash: 380 },
  { q: "Q2'24", cash: 310 },
  { q: "Q3'24", cash: 247 },
  { q: "Q4'24", cash: 187 },
];

function KPICard({
  label,
  value,
  change,
  icon: Icon,
  color = "blue",
}: {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color?: "blue" | "green" | "red" | "amber";
}) {
  const colorMap = {
    blue: { bg: "#eff6ff", icon: "#2563eb", text: "#1d4ed8" },
    green: { bg: "#f0fdf4", icon: "#16a34a", text: "#15803d" },
    red: { bg: "#fef2f2", icon: "#dc2626", text: "#b91c1c" },
    amber: { bg: "#fffbeb", icon: "#d97706", text: "#b45309" },
  };
  const c = colorMap[color];
  const isGrowth = change > 0;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: c.bg }}
        >
          <Icon size={18} style={{ color: c.icon }} />
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded",
            isGrowth ? "bg-growth" : "bg-decline",
          )}
        >
          {isGrowth ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
          {formatPercent(change)}
        </span>
      </div>
      <div className="tabular-nums text-xl font-bold text-slate-800">
        {value}
      </div>
      <div className="text-[12px] text-slate-500 mt-1">{label}</div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-[12px]">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold text-slate-800 tabular-nums">
            {p.value} tỷ
          </span>
        </div>
      ))}
    </div>
  );
};

function RiskItem({
  label,
  level,
  description,
}: {
  label: string;
  level: "high" | "medium" | "low";
  description: string;
}) {
  const colors = {
    high: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      dot: "bg-red-500",
    },
    medium: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },
    low: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
  };
  const c = colors[level];
  return (
    <div className={cn("flex gap-3 p-3 rounded-lg border", c.bg, c.border)}>
      <div className={cn("w-2 h-2 rounded-full mt-1 shrink-0", c.dot)} />
      <div>
        <p className={cn("text-[12px] font-semibold", c.text)}>{label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export function DashboardScreen() {
  const { setCurrentPage } = useAppStore();

  return (
    <div className="overflow-y-auto h-full bg-slate-50">
      <div className="px-6 py-5 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-base font-semibold text-slate-800">
            Dashboard Overview
          </h1>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Dược Phẩm Hà Tây (DHT) · FY2024 · Cập nhật ngày 26/04/2026
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Doanh thu thuần"
            value="2,847 tỷ"
            change={8.2}
            icon={BarChart3}
            color="blue"
          />
          <KPICard
            label="Lợi nhuận ròng"
            value="187 tỷ"
            change={-23.4}
            icon={TrendingDown}
            color="red"
          />
          <KPICard
            label="Biên LN gộp"
            value="23.9%"
            change={-3.0}
            icon={TrendingDown}
            color="amber"
          />
          <KPICard
            label="Tiền mặt"
            value="187 tỷ"
            change={-56.7}
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Revenue & Profit */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-700">
                  Doanh thu & Lợi nhuận
                </h2>
                <p className="text-[11px] text-slate-400">Tỷ VND · theo quý</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="q"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  name="Doanh thu"
                  fill="#bfdbfe"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="profit"
                  name="Lợi nhuận"
                  fill="#2563eb"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Margin trends */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-700">
                  Xu hướng Biên Lợi Nhuận
                </h2>
                <p className="text-[11px] text-slate-400">% · theo năm</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={marginData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="gross"
                  name="Gross"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#2563eb" }}
                />
                <Line
                  type="monotone"
                  dataKey="ebit"
                  name="EBIT"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#7c3aed" }}
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  name="Net"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#16a34a" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cash position */}
          <div className="card p-4">
            <h2 className="text-[13px] font-semibold text-slate-700 mb-1">
              Tiền mặt
            </h2>
            <p className="text-[11px] text-slate-400 mb-3">Tỷ VND · theo quý</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={cashData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="q"
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="cash"
                  stroke="#ef4444"
                  fill="#fee2e2"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk panel */}
          <div className="card p-4 col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-semibold text-slate-700">
                Rủi Ro Nhận Diện
              </h2>
              <span
                className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline"
                onClick={() => setCurrentPage("chat")}
              >
                Phân tích chi tiết →
              </span>
            </div>
            <div className="space-y-2">
              <RiskItem
                level="high"
                label="Thanh khoản thấp"
                description="Tiền mặt giảm 56.7% xuống 187 tỷ, áp lực vay ngắn hạn tăng"
              />
              <RiskItem
                level="high"
                label="Dự án CIP 790 tỷ"
                description="Chưa hoàn thành, tạo áp lực dòng tiền và rủi ro trễ tiến độ"
              />
              <RiskItem
                level="medium"
                label="G&A tăng đột biến"
                description="Chi phí G&A tăng 57.6% cần xác minh nguyên nhân cụ thể"
              />
              <RiskItem
                level="low"
                label="Tỷ giá USD/VND"
                description="Phụ thuộc nguyên liệu nhập khẩu, có thể tác động đến COGS"
              />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: MessageSquare,
              label: "Hỏi AI về DHT",
              sub: "Chat Analyst",
              page: "chat" as const,
              color: "#2563eb",
            },
            {
              icon: FileText,
              label: "Xem tài liệu",
              sub: "3 tài liệu indexed",
              page: "documents" as const,
              color: "#7c3aed",
            },
            {
              icon: BarChart3,
              label: "Chỉ số tài chính",
              sub: "28 chỉ tiêu",
              page: "metrics" as const,
              color: "#16a34a",
            },
            {
              icon: Zap,
              label: "Prompt Library",
              sub: "6 prompt mẫu",
              page: "prompts" as const,
              color: "#d97706",
            },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                onClick={() => setCurrentPage(a.page)}
                className="card card-hover p-4 text-left cursor-pointer group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-105"
                  style={{ background: a.color + "15" }}
                >
                  <Icon size={16} style={{ color: a.color }} />
                </div>
                <p className="text-[13px] font-semibold text-slate-800">
                  {a.label}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{a.sub}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
