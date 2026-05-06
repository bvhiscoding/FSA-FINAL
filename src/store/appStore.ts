import { create } from "zustand";

export type NavPage =
  | "login"
  | "register"
  | "dashboard"
  | "chat"
  | "documents"
  | "prompts"
  | "metrics"
  | "comparison"
  | "reports"
  | "evaluation"
  | "settings";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RagSource {
  id: string;
  contextNumber: number;
  documentId: string;
  documentName: string;
  title?: string;
  page: number | null;
  chunkIndex: number | null;
  chunk: string;
  relevanceScore: number;
  ocrEngine?: string | null;
  type?: string;
}

interface AppState {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  contextPanelOpen: boolean;
  setContextPanelOpen: (v: boolean) => void;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  selectedDocumentSet: string;
  setSelectedDocumentSet: (set: string) => void;
  ragStatus: "active" | "indexing" | "error";
  setRagStatus: (status: "active" | "indexing" | "error") => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  latestSources: RagSource[];
  setLatestSources: (sources: RagSource[]) => void;
  latestStructuredContext: string | null;
  setLatestStructuredContext: (context: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (v) => set({ isAuthenticated: v }),
  user: null,
  setUser: (user) => set({ user }),
  token: null,
  setToken: (token) => set({ token }),
  currentPage: "login",
  setCurrentPage: (page) => set({ currentPage: page }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  contextPanelOpen: true,
  setContextPanelOpen: (v) => set({ contextPanelOpen: v }),
  selectedCompany: "Dược Phẩm Hà Tây (DHT)",
  setSelectedCompany: (company) => set({ selectedCompany: company }),
  selectedDocumentSet: "BCTC 2024 Q4",
  setSelectedDocumentSet: (set_) => set({ selectedDocumentSet: set_ }),
  ragStatus: "active",
  setRagStatus: (status) => set({ ragStatus: status }),
  aiModel: "Local LLM",
  setAiModel: (model) => set({ aiModel: model }),
  latestSources: [],
  setLatestSources: (sources) => set({ latestSources: sources }),
  latestStructuredContext: null,
  setLatestStructuredContext: (context) => set({ latestStructuredContext: context }),
}));
