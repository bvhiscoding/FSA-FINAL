"use client";

import { useState } from "react";
import {
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  X,
  StickyNote,
  BarChart3,
  Cpu,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockMessages } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";

const lastMessage = mockMessages.find((m) => m.role === "assistant");
const sources = lastMessage?.sources || [];

function ScoreDot({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 90 ? "#16a34a" : pct >= 75 ? "#d97706" : "#dc2626";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[10px] font-mono font-semibold" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

function SourceCard({
  source,
  index,
}: {
  source: (typeof sources)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer"
      >
        <FileText size={12} className="text-slate-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-700 truncate">
            {source.documentName}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-slate-400">
              Trang {source.page}
            </span>
            <ScoreDot score={source.relevanceScore} />
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            aria-label="Open in source"
            className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-blue-500 transition-colors z-10 relative"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ExternalLink size={10} />
          </button>
          {expanded ? (
            <ChevronDown size={12} className="text-slate-400" />
          ) : (
            <ChevronRight size={12} className="text-slate-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-2 bg-slate-50 border-t border-slate-100">
          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-4">
            {source.chunk}
          </p>
          <button className="mt-2 text-[10px] text-blue-500 font-medium hover:text-blue-700 cursor-pointer">
            Xem đầy đủ chunk →
          </button>
        </div>
      )}
    </div>
  );
}

function MetricPill({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: number;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-2.5">
      <p className="text-[10px] text-slate-500 leading-tight mb-0.5">{label}</p>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-slate-800 tabular-nums">
          {value}
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold px-1 py-0.5 rounded",
            change > 0 ? "bg-growth" : "bg-decline",
          )}
        >
          {change > 0 ? "+" : ""}
          {change.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

type TabKey = "sources" | "prompt" | "metrics" | "notes";

const tabs: { id: TabKey; label: string; icon: React.ElementType }[] = [
  { id: "sources", label: "Nguồn", icon: FileText },
  { id: "prompt", label: "Prompt", icon: Cpu },
  { id: "metrics", label: "Metrics", icon: BarChart3 },
  { id: "notes", label: "Ghi chú", icon: StickyNote },
];

export function ContextPanel() {
  const { contextPanelOpen, setContextPanelOpen } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabKey>("sources");
  const [note, setNote] = useState(
    "• Cần xác minh nguyên nhân G&A tăng\n• Theo dõi tiến độ CIP Q1 2025\n• So sánh với đối thủ DCL, TRA",
  );

  if (!contextPanelOpen) return null;

  return (
    <aside
      className="flex flex-col bg-white border-l border-slate-200 shrink-0"
      style={{ width: "320px", height: "calc(100vh - 56px)" }}
      aria-label="Context verification panel"
    >
      {/* Panel header */}
      <div className="shrink-0 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-800">
            Context Panel
          </h2>
          <p className="text-[10px] text-slate-400">Kiểm chứng nguồn RAG</p>
        </div>
        <button
          onClick={() => setContextPanelOpen(false)}
          aria-label="Close context panel"
          className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex border-b border-slate-200 px-2 pt-2 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1 px-2 py-1.5 rounded-t-md text-[11px] font-medium transition-colors cursor-pointer border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-700 bg-blue-50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50",
              )}
            >
              <Icon size={11} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {/* Sources tab */}
        {activeTab === "sources" && (
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                {sources.length} nguồn được truy xuất
              </p>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                cosine sim
              </span>
            </div>
            {sources.map((source, i) => (
              <SourceCard key={source.id} source={source} index={i} />
            ))}

            {/* Retrieval info */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-[11px] font-semibold text-blue-700 mb-2">
                Retrieval Config
              </p>
              <div className="space-y-1">
                {[
                  ["Strategy", "Hybrid (BM25 + Dense)"],
                  ["Top-K", "5 chunks"],
                  ["Reranker", "CrossEncoder"],
                  ["Threshold", "0.80"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[10px] text-blue-600">{k}</span>
                    <span className="text-[10px] font-mono text-blue-800">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prompt tab */}
        {activeTab === "prompt" && (
          <div className="p-3">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
              System Prompt Active
            </p>
            <div className="bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-slate-300 leading-relaxed space-y-2">
              <p className="text-blue-400"># Role</p>
              <p>
                You are a professional financial analyst specializing in
                Vietnamese listed companies. Analyze financial reports with
                precision.
              </p>
              <p className="text-blue-400"># Output Format</p>
              <p>
                Always structure responses with: Quick Summary → Detailed
                Analysis → Data Table → Trends → Risks → Sources
              </p>
              <p className="text-blue-400"># Context</p>
              <p>Company: DHT (Dược phẩm Hà Tây)</p>
              <p>Document set: BCTC 2024 Q4</p>
              <p>RAG chunks: {"{context}"}</p>
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Token Usage
              </p>
              {[
                { label: "System", tokens: 342, pct: 8 },
                { label: "Context (RAG)", tokens: 1847, pct: 43 },
                { label: "User message", tokens: 28, pct: 1 },
                { label: "Response", tokens: 847, pct: 20 },
              ].map((t) => (
                <div key={t.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-slate-600">
                      {t.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {t.tokens.toLocaleString()} tok
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${t.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-1 border-t border-slate-100 flex justify-between">
                <span className="text-[11px] text-slate-500">Total</span>
                <span className="text-[11px] font-mono font-semibold text-slate-700">
                  3,064 / 128K
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Metrics tab */}
        {activeTab === "metrics" && (
          <div className="p-3">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Chỉ số liên quan
            </p>
            <div className="grid grid-cols-2 gap-2">
              <MetricPill
                label="Doanh thu thuần"
                value="2,847 tỷ"
                change={8.2}
              />
              <MetricPill
                label="Lợi nhuận ròng"
                value="187 tỷ"
                change={-23.4}
              />
              <MetricPill label="Biên LN gộp" value="23.9%" change={-3.0} />
              <MetricPill label="Tiền mặt" value="187 tỷ" change={-56.7} />
              <MetricPill label="G&A chi phí" value="312 tỷ" change={57.6} />
              <MetricPill label="D/E ratio" value="0.79x" change={46.3} />
            </div>

            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <Hash size={10} className="text-amber-600" />
                <span className="text-[11px] font-semibold text-amber-700">
                  Truy xuất tự động
                </span>
              </div>
              <p className="text-[10px] text-amber-600">
                Các chỉ số trên được trích xuất từ câu trả lời AI và BCTC kiểm
                toán 2024
              </p>
            </div>
          </div>
        )}

        {/* Notes tab */}
        {activeTab === "notes" && (
          <div className="p-3">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Ghi chú phân tích
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú của bạn..."
              className="w-full h-48 p-3 text-[12px] text-slate-700 bg-yellow-50 border border-yellow-200 rounded-lg resize-none outline-none focus:border-yellow-400 leading-relaxed font-medium"
            />
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-slate-400">Tự động lưu</span>
              <button className="text-[11px] text-blue-500 font-medium cursor-pointer hover:text-blue-700">
                Export ghi chú
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Đánh dấu câu trả lời
              </p>
              {[
                "Phân tích DHT FY2024 overview",
                "G&A breakdown",
                "Cash flow analysis",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded-md border border-slate-100"
                >
                  <FileText size={11} className="text-slate-400 shrink-0" />
                  <span className="text-[12px] text-slate-600 flex-1 truncate">
                    {item}
                  </span>
                  <ExternalLink size={10} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
