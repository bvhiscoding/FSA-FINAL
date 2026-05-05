"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, ExternalLink, Filter, Download } from "lucide-react";
import { cn, formatNumber, formatPercent } from "@/lib/utils";
import { mockMetrics, FinancialMetric } from "@/data/mockData";

type GroupKey = "income_statement" | "balance_sheet" | "cash_flow" | "ratios";

const groupLabels: Record<GroupKey, string> = {
  income_statement: "Kết Quả Kinh Doanh",
  balance_sheet: "Bảng Cân Đối Kế Toán",
  cash_flow: "Lưu Chuyển Tiền Tệ",
  ratios: "Chỉ Số Tài Chính",
};

function formatValue(value: number, unit: FinancialMetric["unit"]): string {
  if (unit === "vnd_bn") return `${formatNumber(value, 0)} tỷ`;
  if (unit === "percent") return `${formatNumber(value, 1)}%`;
  if (unit === "ratio") return formatNumber(value, 2);
  if (unit === "times") return `${formatNumber(value, 1)}x`;
  return formatNumber(value);
}

function ChangeCell({ change, unit }: { change: number; unit: FinancialMetric["unit"] }) {
  const isGrowth = change > 0;
  const isDecline = change < 0;
  const isNeutral = change === 0;

  // For some metrics, positive change is bad (costs, debt)
  const Icon = isNeutral ? Minus : isGrowth ? TrendingUp : TrendingDown;

  return (
    <div className={cn(
      "flex items-center justify-end gap-1 text-[12px] font-semibold tabular-nums",
      isGrowth ? "text-emerald-600" : isDecline ? "text-red-600" : "text-slate-400"
    )}>
      <Icon size={11} />
      <span>{formatPercent(change)}</span>
    </div>
  );
}

function MetricRow({ metric }: { metric: FinancialMetric }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group transition-colors"
      style={{ background: hovered ? "#f0f9ff" : undefined }}
    >
      <td className="py-2.5 pl-4 pr-2">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-slate-700">{metric.label}</span>
          {hovered && (
            <a
              href={`#doc-${metric.id}`}
              className="ml-2 text-[10px] flex items-center gap-0.5 text-blue-500 hover:text-blue-700"
              title={`${metric.sourceDoc} · trang ${metric.sourcePage}`}
            >
              <ExternalLink size={9} />
              tr.{metric.sourcePage}
            </a>
          )}
        </div>
      </td>
      <td className="py-2.5 px-3 text-right tabular-nums text-[13px] font-semibold text-slate-800">
        {formatValue(metric.value2024, metric.unit)}
      </td>
      <td className="py-2.5 px-3 text-right tabular-nums text-[13px] text-slate-500">
        {formatValue(metric.value2023, metric.unit)}
      </td>
      <td className="py-2.5 pl-3 pr-4">
        <ChangeCell change={metric.change} unit={metric.unit} />
      </td>
    </tr>
  );
}

function MetricGroup({ groupKey, metrics }: { groupKey: GroupKey; metrics: FinancialMetric[] }) {
  const groupMetrics = metrics.filter(m => m.group === groupKey);
  if (!groupMetrics.length) return null;

  return (
    <div className="card overflow-hidden mb-4">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h2 className="text-[12px] font-semibold text-slate-600 uppercase tracking-wide">{groupLabels[groupKey]}</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-2 pl-4 pr-2 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-1/2">Chỉ tiêu</th>
            <th className="py-2 px-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wide">2024</th>
            <th className="py-2 px-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wide">2023</th>
            <th className="py-2 pl-3 pr-4 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wide">YoY</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {groupMetrics.map(metric => (
            <MetricRow key={metric.id} metric={metric} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MetricsScreen() {
  const [activeGroup, setActiveGroup] = useState<GroupKey | "all">("all");

  const groups: GroupKey[] = ["income_statement", "balance_sheet", "cash_flow", "ratios"];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Financial Metrics</h1>
            <p className="text-[11px] text-slate-400">DHT · Trích xuất từ BCTC 2024 · {mockMetrics.length} chỉ tiêu</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 text-[12px] text-slate-600 border border-slate-200 bg-white px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <Filter size={12} /> Filter
            </button>
            <button className="flex items-center gap-1.5 text-[12px] text-white px-3 py-2 rounded-lg cursor-pointer" style={{ background: "#2563eb" }}>
              <Download size={12} /> Export CSV
            </button>
          </div>
        </div>

        {/* Group filter tabs */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveGroup("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer",
              activeGroup === "all" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            Tất cả
          </button>
          {groups.map(g => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer",
                activeGroup === g ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {groupLabels[g].split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {(activeGroup === "all" ? groups : [activeGroup as GroupKey]).map(g => (
          <MetricGroup key={g} groupKey={g} metrics={mockMetrics} />
        ))}

        {/* Source note */}
        <div className="text-center py-4 text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <ExternalLink size={10} />
          Hover vào từng chỉ tiêu để xem nguồn tài liệu · Trang {" "}
          <span className="text-blue-500 cursor-pointer hover:underline">DHT_BCTC_2024_Kiemtoan.pdf</span>
        </div>
      </div>
    </div>
  );
}
