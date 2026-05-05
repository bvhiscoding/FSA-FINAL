"use client";

import { useState } from "react";
import { format as formatDate } from "date-fns";
import { FileBarChart, Plus, FileText, Settings, Download, Search, MoreVertical, PencilLine, FileAxis3d, Hash, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Report {
  id: string;
  title: string;
  type: string;
  date: Date;
  company: string;
  status: "draft" | "completed";
  author: string;
}

const mockReports: Report[] = [
  { id: "1", title: "Báo cáo phân tích KQKD DHT FY2024", type: "Earnings Analysis", date: new Date("2024-04-20"), company: "DHT", status: "completed", author: "Phuoc Nguyen" },
  { id: "2", title: "Phân tích rủi ro CIP 790 tỷ DHT", type: "Risk Assessment", date: new Date("2024-04-25"), company: "DHT", status: "draft", author: "Phuoc Nguyen" },
  { id: "3", title: "So sánh DHT vs TRA năm 2024", type: "Peer Comparison", date: new Date("2024-04-24"), company: "DHT, TRA", status: "draft", author: "Phuoc Nguyen" },
];

export function ReportsScreen() {
  const [reports] = useState<Report[]>(mockReports);
  const [search, setSearch] = useState("");

  const filtered = reports.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Reports</h1>
            <p className="text-[11px] text-slate-400">Tạo và quản lý báo cáo phân tích</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg cursor-pointer transition-colors" style={{ background: "#2563eb" }}>
            <Plus size={14} /> New Report
          </button>
        </div>

        {/* Templates */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Templates</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: "Earnings Summary", desc: "Tóm tắt KQKD & biến động chính", icon: FileAxis3d, color: "#2563eb" },
              { title: "Deep-dive Analysis", desc: "Phân tích chi tiết P&L, CĐKT, LCTT", icon: FileBarChart, color: "#16a34a" },
              { title: "AI Generated", desc: "Tổng hợp từ cuộc hội thoại chat", icon: Bot, color: "#7c3aed" },
            ].map(t => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="card card-hover p-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: t.color + "15", color: t.color }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3 className="text-[12px] font-medium text-slate-800">{t.title}</h3>
                      <p className="text-[10px] text-slate-400">{t.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Tìm báo cáo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="py-2.5 px-4 text-[11px] font-semibold text-slate-500 uppercase">Tên báo cáo</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-slate-500 uppercase">Loại</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-slate-500 uppercase">Công ty</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-slate-500 uppercase">Ngày tạo</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-slate-500 uppercase text-right">Trạng thái</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-slate-500 uppercase text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map(report => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-slate-400" />
                      <span className="text-[13px] font-medium text-slate-800">{report.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[12px] text-slate-600">{report.type}</td>
                  <td className="py-3 px-4 text-[12px] text-slate-600"><span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">{report.company}</span></td>
                  <td suppressHydrationWarning className="py-3 px-4 text-[12px] text-slate-600">{formatDate(report.date, "dd/MM/yyyy")}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      "inline-flex px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide",
                      report.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                        <PencilLine size={13} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded" title="Export PDF">
                        <Download size={13} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded">
                        <MoreVertical size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-slate-400">Không tìm thấy báo cáo</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
