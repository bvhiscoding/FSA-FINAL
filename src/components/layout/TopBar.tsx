"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import {
  Building2,
  Database,
  Cpu,
  User,
  ChevronDown,
  Bell,
  CheckCircle2,
  Loader2,
  AlertCircle,
  TrendingUp,
  Settings,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

function RagStatusBadge({
  status,
}: {
  status: "active" | "indexing" | "error";
}) {
  if (status === "active")
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <CheckCircle2 size={10} />
        RAG Active
      </span>
    );
  if (status === "indexing")
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        <Loader2 size={10} className="animate-spin" />
        Indexing...
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
      <AlertCircle size={10} />
      RAG Error
    </span>
  );
}

export function TopBar() {
  const {
    selectedCompany,
    setSelectedCompany,
    selectedDocumentSet,
    setSelectedDocumentSet,
    ragStatus,
    aiModel,
    setAiModel,
    contextPanelOpen,
    setContextPanelOpen,
    user,
    setIsAuthenticated,
    setToken,
    setCurrentPage
  } = useAppStore();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setCurrentPage("login");
  };

  return (
    <header
      className="h-14 flex items-center px-4 border-b border-slate-200 bg-white gap-3 shrink-0 z-40"
      style={{ borderBottom: "1px solid #e2e8f0" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
        >
          <TrendingUp size={14} className="text-white" />
        </div>
        <span className="font-semibold text-slate-800 text-sm">
          FinSight AI
        </span>
        <div className="w-px h-4 bg-slate-200 mx-1" />
      </div>

      {/* Company & Doc context */}
      <div className="flex items-center gap-2 flex-1">
        {/* Company */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-1.5 text-[12px] px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer outline-none">
              <Building2 size={12} className="text-blue-500 shrink-0" />
              <span className="font-medium">{selectedCompany}</span>
              <ChevronDown size={10} className="text-slate-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[200px] bg-white rounded-md p-1 shadow-md border border-slate-200 text-sm z-50">
              <DropdownMenu.Item className="px-2 py-1.5 text-slate-700 outline-none hover:bg-blue-50 cursor-pointer rounded" onClick={() => setSelectedCompany("Dược Phẩm Hà Tây (DHT)")}>Dược Phẩm Hà Tây (DHT)</DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 text-slate-700 outline-none hover:bg-blue-50 cursor-pointer rounded" onClick={() => setSelectedCompany("Vinamilk (VNM)")}>Vinamilk (VNM)</DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 text-slate-700 outline-none hover:bg-blue-50 cursor-pointer rounded" onClick={() => setSelectedCompany("FPT Corporation (FPT)")}>FPT Corporation (FPT)</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Document set */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-1.5 text-[12px] px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer outline-none">
              <Database size={12} className="text-violet-500 shrink-0" />
              <span className="font-medium">{selectedDocumentSet}</span>
              <span className="text-[10px] text-slate-400 ml-0.5">· 3 docs</span>
              <ChevronDown size={10} className="text-slate-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[150px] bg-white rounded-md p-1 shadow-md border border-slate-200 text-sm z-50">
              <DropdownMenu.Item className="px-2 py-1.5 text-slate-700 outline-none hover:bg-blue-50 cursor-pointer rounded" onClick={() => setSelectedDocumentSet("BCTC 2024 Q4")}>BCTC 2024 Q4</DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 text-slate-700 outline-none hover:bg-blue-50 cursor-pointer rounded" onClick={() => setSelectedDocumentSet("BCTC 2023 FY")}>BCTC 2023 FY</DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 text-slate-700 outline-none hover:bg-blue-50 cursor-pointer rounded" onClick={() => setSelectedDocumentSet("All Documents")}>All Documents</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* RAG Status */}
        <RagStatusBadge status={ragStatus} />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* AI Model */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-1.5 text-[12px] px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer outline-none">
              <Cpu size={12} className="text-blue-500 shrink-0" />
              <span className="font-medium">{aiModel}</span>
              <ChevronDown size={10} className="text-slate-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[150px] bg-white rounded-md p-1 shadow-md border border-slate-200 text-sm z-50">
              <DropdownMenu.Item className="px-2 py-1.5 text-slate-700 outline-none hover:bg-blue-50 cursor-pointer rounded" onClick={() => setAiModel("Local LLM")}>Local LLM</DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 text-slate-700 outline-none hover:bg-blue-50 cursor-pointer rounded" onClick={() => setAiModel("GPT-4o")}>GPT-4o</DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 text-slate-700 outline-none hover:bg-blue-50 cursor-pointer rounded" onClick={() => setAiModel("Claude 3.5")}>Claude 3.5</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Context Panel toggle */}
        <button
          onClick={() => setContextPanelOpen(!contextPanelOpen)}
          aria-label={
            contextPanelOpen ? "Hide context panel" : "Show context panel"
          }
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-md border transition-colors cursor-pointer",
            contextPanelOpen
              ? "border-blue-200 bg-blue-50 text-blue-600"
              : "border-slate-200 text-slate-500 hover:bg-slate-50",
          )}
        >
          {contextPanelOpen ? (
            <PanelRightClose size={15} />
          ) : (
            <PanelRightOpen size={15} />
          )}
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors relative cursor-pointer"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200" />

        {/* User avatar */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              aria-label="User menu"
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-50 transition-colors cursor-pointer outline-none"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
              >
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "NP"}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[12px] font-medium text-slate-800 leading-tight">
                  {user?.name || "Nguyễn Phước"}
                </div>
                <div className="text-[10px] text-slate-400">{user?.role || "Senior Analyst"}</div>
              </div>
              <ChevronDown size={10} className="text-slate-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[180px] bg-white rounded-md p-1 shadow-md border border-slate-200 text-sm z-50 mr-4">
              <div className="px-2 py-1.5 mb-1 border-b border-slate-100">
                <div className="font-medium text-slate-800">{user?.name || "Nguyễn Phước"}</div>
                <div className="text-[11px] text-slate-500">{user?.email || "nguyenphuoc@finsight.ai"}</div>
              </div>
              <DropdownMenu.Item className="px-2 py-1.5 text-slate-700 outline-none hover:bg-blue-50 cursor-pointer rounded flex items-center gap-2" onClick={() => setCurrentPage("settings")}>
                <Settings size={14} /> Cài đặt
              </DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 text-red-600 outline-none hover:bg-red-50 cursor-pointer rounded flex items-center gap-2" onClick={handleLogout}>
                <User size={14} /> Đăng xuất
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <button
          aria-label="Settings"
          className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
}
