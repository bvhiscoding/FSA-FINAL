"use client";

import { useAppStore } from "@/store/appStore";
import { User, Key, Database, Bell, Trash2, ShieldAlert, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface OllamaModel {
  name: string;
  model: string;
}

export function SettingsScreen() {
  const { aiModel, setAiModel, setIsAuthenticated, setCurrentPage } = useAppStore();
  const [remoteModels, setRemoteModels] = useState<OllamaModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch("https://inspirative-separately-earlean.ngrok-free.dev/api/tags", {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.models) {
            setRemoteModels(data.models);
            
            // Auto-select the first remote model if the current one isn't valid or is still default
            if (!aiModel || aiModel === "Local LLM" || aiModel === "GPT-4o") {
              if (data.models.length > 0) {
                setAiModel(data.models[0].name);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch remote models:", error);
      } finally {
        setLoadingModels(false);
      }
    }
    
    fetchModels();
  }, [aiModel, setAiModel]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("login");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div>
          <h1 className="text-sm font-semibold text-slate-800">Settings</h1>
          <p className="text-[11px] text-slate-400">
            Quản lý cấu hình tài khoản, workspace và RAG pipeline
          </p>
        </div>
      </div>

      <div className="p-6 max-w-4xl w-full mx-auto space-y-6">
        {/* Profile Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-blue-600" />
            <h2 className="text-[14px] font-semibold text-slate-800">Profile</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br from-blue-600 to-purple-600">
              NP
            </div>
            <div>
              <p className="font-semibold text-slate-800">Nguyễn Phước</p>
              <p className="text-[13px] text-slate-500">phuoc.nguyen@company.com</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] rounded font-medium">Senior Analyst</span>
            </div>
          </div>
          <button className="text-[13px] text-slate-600 border border-slate-200 px-4 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer">
            Edit Profile
          </button>
        </div>

        {/* API & LLM Config */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={16} className="text-emerald-600" />
            <h2 className="text-[14px] font-semibold text-slate-800">AI Model & API</h2>
          </div>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">
                Active LLM (Ollama Remote)
              </label>
              <select 
                value={aiModel} 
                onChange={(e) => setAiModel(e.target.value)}
                disabled={loadingModels}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-[13px] text-slate-700 bg-white focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
              >
                {loadingModels ? (
                  <option value="">Loading models...</option>
                ) : remoteModels.length > 0 ? (
                  remoteModels.map((model) => (
                    <option key={model.name} value={model.name}>
                      {model.name} (Local/Self-hosted)
                    </option>
                  ))
                ) : (
                  <>
                    <option value="GPT-4o">GPT-4o (OpenAI)</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                    <option value="Qwen 2.5 32B">Qwen 2.5 32B (Fallback Local)</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">
                API Key (nếu dùng cloud provider)
              </label>
              <input 
                type="password" 
                defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-[13px] text-slate-700 font-mono focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">
                Temperature (0.0 - 1.0)
              </label>
              <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="w-full" />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0.0 (Precise)</span>
                <span>0.2 (Current)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RAG Configuration */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database size={16} className="text-violet-600" />
            <h2 className="text-[14px] font-semibold text-slate-800">RAG Settings (Qdrant)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">Top-K Chunks</label>
              <input type="number" defaultValue="5" className="w-full border border-slate-200 rounded-md px-3 py-2 text-[13px] font-mono text-slate-700" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">Similarity Threshold</label>
              <input type="number" step="0.05" defaultValue="0.80" className="w-full border border-slate-200 rounded-md px-3 py-2 text-[13px] font-mono text-slate-700" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">Chunk Size (tokens)</label>
              <input type="number" defaultValue="512" className="w-full border border-slate-200 rounded-md px-3 py-2 text-[13px] font-mono text-slate-700" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">Chunk Overlap (tokens)</label>
              <input type="number" defaultValue="50" className="w-full border border-slate-200 rounded-md px-3 py-2 text-[13px] font-mono text-slate-700" />
            </div>
            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span className="text-[13px] text-slate-700">Enable Cross-Encoder Reranking (Improves accuracy, slower)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Notification */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-amber-600" />
            <h2 className="text-[14px] font-semibold text-slate-800">Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span className="text-[13px] text-slate-700">Email khi Document processing hoàn tất</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span className="text-[13px] text-slate-700">In-app alert khi Report generation hoàn tất</span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={16} className="text-red-600" />
            <h2 className="text-[14px] font-semibold text-red-600">Danger Zone</h2>
          </div>
          <div className="flex flex-col gap-3 max-w-sm">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-md text-[13px] font-medium hover:bg-red-50 transition-colors cursor-pointer">
              <Trash2 size={14} /> Clear Cache & Re-index All Documents
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-[13px] font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

