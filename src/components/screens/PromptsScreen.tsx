"use client";

import { useState } from "react";
import {
  Search,
  Play,
  ChevronRight,
  BookOpen,
  Tag,
  Variable,
  FileOutput,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockPrompts, PromptTemplate } from "@/data/mockData";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";

const categories = [
  "All",
  "Revenue",
  "Profitability",
  "Cash Flow",
  "Balance Sheet",
  "Risk",
  "Comparison",
];

const categoryColors: Record<string, string> = {
  Revenue: "bg-blue-50 text-blue-700 border-blue-200",
  Profitability: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Cash Flow": "bg-violet-50 text-violet-700 border-violet-200",
  "Balance Sheet": "bg-amber-50 text-amber-700 border-amber-200",
  Risk: "bg-red-50 text-red-700 border-red-200",
  Comparison: "bg-slate-50 text-slate-700 border-slate-200",
};

function PromptCard({
  prompt,
  onUse,
}: {
  prompt: PromptTemplate;
  onUse: (p: PromptTemplate) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const colorClass =
    categoryColors[prompt.category] ||
    "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("status-badge border text-[10px]", colorClass)}>
              <Tag size={8} />
              {prompt.category}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <Play size={8} /> {prompt.usageCount} lần dùng
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            {prompt.title}
          </h3>
          <p className="text-[12px] text-slate-500 leading-relaxed">
            {prompt.description}
          </p>

          {/* Variables */}
          <div className="flex flex-wrap gap-1 mt-2">
            {prompt.variables.map((v) => (
              <span
                key={v}
                className="flex items-center gap-0.5 text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded font-mono"
              >
                <Variable size={8} />
                {"{" + v + "}"}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            aria-label="Preview prompt"
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronRight
              size={13}
              className={cn("transition-transform", expanded && "rotate-90")}
            />
          </button>
          <button
            onClick={() => onUse(prompt)}
            className="flex items-center gap-1.5 text-[12px] font-medium text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ background: "#2563eb" }}
          >
            <Play size={11} /> Dùng ngay
          </button>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-slate-100"
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <FileOutput size={9} /> Output Format
              </p>
              <p className="text-[12px] text-slate-600">
                {prompt.outputFormat}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
              <BookOpen size={9} /> Template
            </p>
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-[11px] text-slate-300 leading-relaxed text-left">
              {prompt.template}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function PromptsScreen() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { setCurrentPage } = useAppStore();

  const filtered = mockPrompts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleUse = (prompt: PromptTemplate) => {
    setCurrentPage("chat");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-sm font-semibold text-slate-800">
              Prompt Library
            </h1>
            <p className="text-[11px] text-slate-400">
              {mockPrompts.length} prompt mẫu cho phân tích tài chính
            </p>
          </div>
          <button
            className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg cursor-pointer"
            style={{ background: "#2563eb" }}
          >
            + Tạo Prompt Mới
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer",
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            placeholder="Tìm prompt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          />
        </div>
      </div>

      {/* Prompt list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {filtered.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} onUse={handleUse} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm text-slate-400">Không tìm thấy prompt</p>
          </div>
        )}
      </div>
    </div>
  );
}
