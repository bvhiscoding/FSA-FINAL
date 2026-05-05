"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  BookMarked,
  BarChart3,
  GitCompare,
  FileBarChart,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore, NavPage } from "@/store/appStore";

const navItems: { id: NavPage; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "Chat Analyst", icon: MessageSquare, badge: "AI" },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "prompts", label: "Prompt Library", icon: BookMarked },
  { id: "metrics", label: "Financial Metrics", icon: BarChart3 },
  { id: "comparison", label: "Comparison", icon: GitCompare },
  { id: "reports", label: "Reports", icon: FileBarChart },
  { id: "evaluation", label: "Evaluation", icon: Star },
];

const bottomItems: { id: NavPage; label: string; icon: React.ElementType }[] = [
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { currentPage, setCurrentPage, sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-out shrink-0",
        sidebarCollapsed ? "w-[56px]" : "w-[240px]"
      )}
      style={{ height: `calc(100vh - 56px)` }}
      aria-label="Main navigation"
    >
      {/* Collapse toggle on the right edge */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 shadow-sm hover:shadow transition-all z-50 cursor-pointer"
      >
        {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo area */}
      {/* Logo area removed */}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className={cn(
          "text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2",
          sidebarCollapsed && "hidden"
        )}>
          Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer group",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                sidebarCollapsed && "justify-center px-1"
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
                      style={{ background: "#2563eb" }}
                    >
                      {item.badge}
                    </span>
                  )}

                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="px-2 py-3 border-t border-slate-100 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              aria-label={item.label}
              className={cn(
                "w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer group",
                isActive ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                sidebarCollapsed && "justify-center px-1"
              )}
            >
              <Icon size={16} className={cn("shrink-0", isActive ? "text-blue-600" : "text-slate-400")} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
