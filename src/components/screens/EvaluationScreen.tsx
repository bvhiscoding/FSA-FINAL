"use client";

import React, { useState } from "react";
import {
  Play,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Settings,
} from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const evalHistory = [
  { run: "Run 1", accuracy: 82, retrieval: 85, relevance: 80, latency: 2.8 },
  { run: "Run 2", accuracy: 84, retrieval: 88, relevance: 81, latency: 2.5 },
  { run: "Run 3", accuracy: 85, retrieval: 86, relevance: 85, latency: 2.4 },
  { run: "Run 4", accuracy: 87, retrieval: 92, relevance: 84, latency: 2.1 },
];

const testCases = [
  {
    id: 1,
    question: "Doanh thu thuần của DHT năm 2024 là bao nhiêu?",
    expected: "2,847 tỷ đồng",
    actual: "Doanh thu thuần năm 2024 đạt 2,847 tỷ đồng, tăng 8.2%...",
    score: 0.95,
    sources: 3,
    status: "pass",
  },
  {
    id: 2,
    question: "ROE của DHT năm 2024?",
    expected: "8.7%",
    actual: "Tỷ suất lợi nhuận trên vốn chủ sở hữu (ROE) năm 2024 là 8.7%...",
    score: 0.88,
    sources: 2,
    status: "pass",
  },
  {
    id: 3,
    question: "Chi phí xây dựng cơ bản dở dang của dự án nhà máy là bao nhiêu?",
    expected: "790 tỷ đồng",
    actual: "Chi phí XDCB dở dang là 790 tỷ...",
    score: 0.72,
    sources: 1,
    status: "warn",
  },
  {
    id: 4,
    question: "Tại sao G&A tăng mạnh?",
    expected: "Do tăng chi phí khấu hao và chi phí nhân sự",
    actual: "Không tìm thấy thông tin cụ thể về nguyên nhân tăng chi phí G&A...",
    score: 0.3,
    sources: 0,
    status: "fail",
  },
];

function ScoreCard({
  label,
  value,
  change,
  suffix = "%",
}: {
  label: string;
  value: number;
  change: number;
  suffix?: string;
}) {
  const isGrowth = change > 0;
  return (
    <div className="card p-4">
      <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <div className="flex items-end gap-3">
        <span className="text-2xl font-bold text-slate-800 tabular-nums">
          {value}
          {suffix}
        </span>
        <span
          className={cn(
            "text-[12px] font-semibold mb-1",
            isGrowth ? "text-emerald-600" : "text-red-600"
          )}
        >
          {isGrowth ? "▲" : "▼"} {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
}

export function EvaluationScreen() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-sm font-semibold text-slate-800">
              RAG Evaluation
            </h1>
            <p className="text-[11px] text-slate-400">
              Đánh giá chất lượng pipeline RAG · 12 test cases
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 bg-white px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <Download size={14} /> Export Results
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded-lg cursor-pointer transition-colors bg-blue-600 hover:bg-blue-700">
              <Play size={14} /> Run Evaluation
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-6xl mx-auto w-full">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard label="Accuracy" value={87.3} change={2.1} />
          <ScoreCard label="Retrieval Quality" value={92.1} change={5.3} />
          <ScoreCard label="Response Relevance" value={84.6} change={-1.2} />
          <ScoreCard label="Avg Latency" value={2.1} change={-14.2} suffix="s" />
        </div>

        {/* Charts and Config */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-4 col-span-2">
            <h2 className="text-[13px] font-semibold text-slate-700 mb-4">
              Quality Trends over Time
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={evalHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="run" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} domain={['auto', 100]} />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="retrieval" name="Retrieval" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="relevance" name="Relevance" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={14} className="text-slate-500" />
              <h2 className="text-[13px] font-semibold text-slate-700">
                Pipeline Config
              </h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Vector DB", value: "Qdrant (Local)" },
                { label: "Embedding", value: "BAAI/bge-m3" },
                { label: "Chunk Size", value: "512 tokens" },
                { label: "Chunk Overlap", value: "50 tokens" },
                { label: "Retrieval", value: "Hybrid (BM25 + Dense)" },
                { label: "Top-K", value: "5" },
                { label: "LLM", value: "Qwen 2.5 32B" },
              ].map((c) => (
                <div key={c.label} className="flex justify-between items-center text-[12px] border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-500">{c.label}</span>
                  <span className="font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test Cases Table */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h2 className="text-[12px] font-semibold text-slate-600 uppercase tracking-wide">
              Test Cases Details
            </h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="py-2.5 pl-4 pr-2 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-2/5">
                  Question
                </th>
                <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Expected
                </th>
                <th className="py-2.5 px-3 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-24">
                  Score
                </th>
                <th className="py-2.5 px-3 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-24">
                  Sources
                </th>
                <th className="py-2.5 pl-3 pr-4 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-24">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {testCases.map((tc) => (
                <React.Fragment key={tc.id}>
                  <tr 
                    onClick={() => setExpandedRow(expandedRow === tc.id ? null : tc.id)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 pl-4 pr-2 text-[13px] font-medium text-slate-800 line-clamp-1">
                      {tc.question}
                    </td>
                    <td className="py-3 px-3 text-[12px] text-slate-500 truncate max-w-[200px]">
                      {tc.expected}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn(
                        "text-[12px] font-mono font-semibold",
                        tc.score >= 0.8 ? "text-emerald-600" : tc.score >= 0.6 ? "text-amber-600" : "text-red-600"
                      )}>
                        {tc.score.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit mx-auto">
                        <FileText size={10} /> {tc.sources}
                      </div>
                    </td>
                    <td className="py-3 pl-3 pr-4 text-right">
                      <div className="flex justify-end">
                        {tc.status === "pass" && <CheckCircle2 size={16} className="text-emerald-500" />}
                        {tc.status === "warn" && <AlertTriangle size={16} className="text-amber-500" />}
                        {tc.status === "fail" && <XCircle size={16} className="text-red-500" />}
                      </div>
                    </td>
                  </tr>
                  
                  {expandedRow === tc.id && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={5} className="p-4 border-t border-dashed border-slate-200">
                        <div className="grid grid-cols-2 gap-4 text-[13px]">
                          <div>
                            <p className="font-semibold text-slate-600 mb-1">Expected Answer</p>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700">
                              {tc.expected}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-600 mb-1">Actual Generated Output</p>
                            <div className={cn(
                              "p-3 bg-white border rounded-lg text-slate-700",
                              tc.status === "pass" ? "border-emerald-200" : tc.status === "fail" ? "border-red-200 bg-red-50/30" : "border-amber-200 bg-amber-50/30"
                            )}>
                              {tc.actual}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
