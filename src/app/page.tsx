"use client";

import { useAppStore } from "@/store/appStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ContextPanel } from "@/components/layout/ContextPanel";

import { LoginScreen } from "@/components/screens/LoginScreen";
import { RegisterScreen } from "@/components/screens/RegisterScreen";
import { DashboardScreen } from "@/components/screens/DashboardScreen";
import { ChatScreen } from "@/components/screens/ChatScreen";
import { DocumentsScreen } from "@/components/screens/DocumentsScreen";
import { PromptsScreen } from "@/components/screens/PromptsScreen";
import { MetricsScreen } from "@/components/screens/MetricsScreen";
import { ReportsScreen } from "@/components/screens/ReportsScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { ComparisonScreen } from "@/components/screens/ComparisonScreen";
import { EvaluationScreen } from "@/components/screens/EvaluationScreen";
import { Building2 } from "lucide-react";

export default function AppShell() {
  const { currentPage, isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    if (currentPage === "register") {
      return <RegisterScreen />;
    }
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardScreen />;
      case "chat":
        return <ChatScreen />;
      case "documents":
        return <DocumentsScreen />;
      case "prompts":
        return <PromptsScreen />;
      case "metrics":
        return <MetricsScreen />;
      case "reports":
        return <ReportsScreen />;
      case "settings":
        return <SettingsScreen />;
      case "comparison":
        return <ComparisonScreen />;
      case "evaluation":
        return <EvaluationScreen />;
      default:
        return <ChatScreen />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 text-slate-800 font-sans">
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 min-w-0 overflow-hidden shadow-[-4px_0_12px_rgba(0,0,0,0.02)] relative z-10">
          {renderScreen()}
        </main>

        <ContextPanel />
      </div>
    </div>
  );
}

