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
  Trash2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/appStore";

export interface AppDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  company: string;
  year: number;
  quarter?: string | null;
  status: string;
  pages?: number | null;
  chunks?: number | null;
  createdAt?: string | Date;
  uploadedAt?: string | Date;
  parsedPath?: string | null;
  parsedPreview?: string | null;
  ocrEngine?: string | null;
  errorMessage?: string | null;
}

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

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.indexed;
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

function ProcessingProgress({ status }: { status: string }) {
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

function DocIcon({ type }: { type: string }) {
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

function DocumentCard({
  doc,
  onPreview,
  onDelete,
}: {
  doc: AppDocument;
  onPreview: (doc: AppDocument) => void;
  onDelete: (doc: AppDocument) => void;
}) {
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
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={doc.status} />
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {doc.status === "indexed" && (
                  <button
                    aria-label="Preview parsed OCR"
                    onClick={() => onPreview(doc)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <Eye size={13} />
                  </button>
                )}
                <button
                  aria-label="Delete document"
                  onClick={() => onDelete(doc)}
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>

          {isProcessing && <ProcessingProgress status={doc.status} />}

          {doc.status === "error" && doc.errorMessage && (
            <p className="text-[11px] text-red-500 mt-2 line-clamp-2">{doc.errorMessage}</p>
          )}

          {doc.status === "indexed" && (
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[11px] text-slate-500">
                {doc.pages} trang
              </span>
              <span className="text-[11px] text-slate-500">
                {doc.chunks?.toLocaleString()} chunks
              </span>
              <span className="text-[11px] text-slate-400">
                {doc.createdAt ? String(doc.createdAt).substring(0, 10) : doc.uploadedAt ? String(doc.uploadedAt).substring(0, 10) : ""}
              </span>
            </div>
          )}
        </div>

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
  const [previewDoc, setPreviewDoc] = useState<AppDocument | null>(null);
  const [parsedMarkdown, setParsedMarkdown] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
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

  useEffect(() => {
    const hasProcessing = documents.some((doc) => doc.status !== "indexed" && doc.status !== "error");
    if (!hasProcessing) return;

    const interval = window.setInterval(() => {
      fetchDocuments();
    }, 1500);

    return () => window.clearInterval(interval);
  }, [documents, selectedCompany, token]);

  const openParsedPreview = async (doc: AppDocument) => {
    setPreviewDoc(doc);
    setParsedMarkdown("");
    setLoadingPreview(true);
    try {
      const res = await fetch(`/api/documents/${doc.id}/parsed`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không đọc được parsed OCR");
      setParsedMarkdown(data.markdown || "");
    } catch (err) {
      setParsedMarkdown(err instanceof Error ? err.message : "Không đọc được parsed OCR");
    } finally {
      setLoadingPreview(false);
    }
  };

  const deleteDocument = async (doc: AppDocument) => {
    if (!token) {
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    const confirmed = window.confirm(`Xóa tài liệu "${doc.name}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/documents/${doc.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Không xóa được tài liệu");
      }
      setDocuments((current) => current.filter((item) => item.id !== doc.id));
    } catch (err) {
      console.error("Delete document error", err);
      alert(err instanceof Error ? err.message : "Lỗi khi xóa tài liệu");
    }
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    if (!token) {
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!selectedCompany) {
      alert("Vui lòng chọn công ty trước khi upload tài liệu.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("company", selectedCompany);
    formData.append("year", "2024");
    formData.append("quarter", "Q4");

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || data?.details || `Upload failed (${res.status})`);
      }

      if (data?.documents?.length) {
        setDocuments((current) => [...data.documents, ...current]);
      } else {
        await fetchDocuments();
      }
    } catch (err) {
      console.error("Upload error", err);
      alert(err instanceof Error ? err.message : "Lỗi khi tải lên tài liệu");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await uploadFiles(Array.from(e.target.files || []));
  };

  const filtered = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase()),
  );

  const indexed = filtered.filter((d) => d.status === "indexed").length;
  const totalChunks = filtered.reduce((sum, doc) => sum + (doc.chunks || 0), 0);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Documents</h1>
            <p className="text-[11px] text-slate-400">
              {indexed}/{documents.length} indexed · Bộ tài liệu BCTC 2024
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
            {uploading ? "Uploading..." : "Upload Documents"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept=".pdf,.docx,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.bmp,.tif,.tiff,.webp"
            multiple
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
            { label: "Tổng chunks", value: totalChunks.toLocaleString(), color: "text-blue-600" },
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
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            uploadFiles(Array.from(e.dataTransfer.files));
          }}
          onDragOver={(e) => e.preventDefault()}
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
            <span onClick={() => fileInputRef.current?.click()} className="text-blue-500 cursor-pointer">chọn file</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            PDF, DOCX, TXT, ảnh · Có thể chọn nhiều file · Tối đa 100MB/file
          </p>
        </div>
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {filtered.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} onPreview={openParsedPreview} onDelete={deleteDocument} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm text-slate-400">Không tìm thấy tài liệu</p>
          </div>
        )}
      </div>

      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Parsed OCR</h2>
                <p className="text-[11px] text-slate-400">{previewDoc.name}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
            <pre className="p-4 overflow-auto text-xs whitespace-pre-wrap text-slate-700 flex-1">
              {loadingPreview ? "Đang tải parsed OCR..." : parsedMarkdown}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
