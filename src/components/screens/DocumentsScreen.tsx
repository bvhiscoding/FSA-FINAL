"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Upload,
  Search,
  Filter,
  Eye,
  Cpu,
  FileSpreadsheet,
  X,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/appStore";

const statusConfig = {
  indexed: {
    label: "Indexed",
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    className: "text-amber-600 bg-amber-50 border-amber-200",
    animate: true,
  },
  parsing: {
    label: "Parsing",
    icon: Cpu,
    className: "text-blue-600 bg-blue-50 border-blue-200",
    animate: true,
  },
  ocr: {
    label: "OCR",
    icon: Cpu,
    className: "text-violet-600 bg-violet-50 border-violet-200",
    animate: true,
  },
  chunking: {
    label: "Chunking",
    icon: Loader2,
    className: "text-orange-600 bg-orange-50 border-orange-200",
    animate: true,
  },
  embedding: {
    label: "Embedding",
    icon: Loader2,
    className: "text-indigo-600 bg-indigo-50 border-indigo-200",
    animate: true,
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    className: "text-red-600 bg-red-50 border-red-200",
  },
};

const processingSteps = [
  "parsing",
  "ocr",
  "chunking",
  "embedding",
  "indexed",
] as const;

function StatusBadge({ status }: { status: Document["status"] }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={cn("status-badge border", config.className)}>
      <Icon
        size={10}
        className={cn(
          (config as { animate?: boolean }).animate && "animate-spin",
        )}
      />
      {config.label}
    </span>
  );
}

function ProcessingProgress({ status }: { status: Document["status"] }) {
  const stepIndex = processingSteps.indexOf(
    status as (typeof processingSteps)[number],
  );
  if (stepIndex < 0) return null;
  const progress = ((stepIndex + 1) / processingSteps.length) * 100;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {processingSteps.map((step, i) => (
          <div
            key={step}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-500",
              i <= stepIndex ? "bg-blue-500" : "bg-slate-200",
            )}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {processingSteps.map((step, i) => (
          <span
            key={step}
            className={cn(
              "text-[9px] capitalize",
              i <= stepIndex ? "text-blue-500 font-medium" : "text-slate-300",
            )}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

function DocIcon({ type }: { type: Document["type"] }) {
  if (type === "xlsx")
    return (
      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
        <FileSpreadsheet size={16} className="text-emerald-600" />
      </div>
    );
  return (
    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
      <FileText size={16} className="text-red-500" />
    </div>
  );
}

function DocumentCard({ doc }: { doc: Document }) {
  const isProcessing = doc.status !== "indexed" && doc.status !== "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover p-4 cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        <DocIcon type={doc.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-slate-800 truncate leading-tight">
                {doc.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {doc.company} · {doc.year}
                {doc.quarter ? ` ${doc.quarter}` : ""} · {doc.size}
              </p>
            </div>
            <StatusBadge status={doc.status} />
          </div>

          {isProcessing && <ProcessingProgress status={doc.status} />}

          {doc.status === "indexed" && (
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[11px] text-slate-500">
                {doc.pages} trang
              </span>
              <span className="text-[11px] text-slate-500">
                {doc.chunks?.toLocaleString()} chunks
              </span>
              <span className="text-[11px] text-slate-400">
                {doc.uploadedAt.toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
        </div>

        {doc.status === "indexed" && (
          <button
            aria-label="Preview document"
            className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
          >
            <Eye size={13} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function DocumentsScreen() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token, selectedCompany } = useAppStore();

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`/api/documents?company=${encodeURIComponent(selectedCompany)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCompany, token]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("company", selectedCompany);
    formData.append("year", "2024"); // Default for now
    formData.append("quarter", "Q4");

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      await fetchDocuments();
    } catch (err) {
      console.error("Upload error", err);
      alert("Lỗi khi tải lên tài liệu");
    } finally {
      setUploading(false);
    }
  };

  const filtered = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase()),
  );

  const indexed = filtered.filter((d) => d.status === "indexed" || d.status === "processing").length;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Documents</h1>
            <p className="text-[11px] text-slate-400">
              {indexed}/{mockDocuments.length} indexed · Bộ tài liệu BCTC 2024
              Q4
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            style={{ background: "#2563eb" }}
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept=".pdf,.xlsx,.docx"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            {
              label: "Tổng tài liệu",
              value: documents.length,
              color: "text-slate-700",
            },
            { label: "Đã indexed", value: indexed, color: "text-emerald-600" },
            {
              label: "Đang xử lý",
              value: documents.length - indexed,
              color: "text-amber-600",
            },
            { label: "Tổng chunks", value: "0", color: "text-blue-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50 rounded-lg p-3">
              <div className={cn("text-xl font-bold tabular-nums", stat.color)}>
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search & filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Tìm tài liệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
            />
          </div>
          <button className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 bg-white px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <Filter size={13} /> Filter
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div className="px-6 pt-4">
        <div
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={() => setIsDragging(false)}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200",
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50",
          )}
        >
          <Upload size={20} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-600">
            Kéo thả hoặc{" "}
            <span className="text-blue-500 cursor-pointer">chọn file</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            PDF, XLSX, DOCX · Tối đa 100MB
          </p>
        </div>
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {filtered.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm text-slate-400">Không tìm thấy tài liệu</p>
          </div>
        )}
      </div>
    </div>
  );
}
