"use client";

import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import {
  TrendingUp,
  Mail,
  Lock,
  LogIn,
  Loader2,
  Eye,
  EyeOff,
  Bot,
  BarChart3,
  TrendingDown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────── Right-panel mock data ─────────────────────────── */
const CHAT_MESSAGES = [
  {
    role: "user",
    text: "Phân tích tình hình tài chính của VNM trong Q4 2024?",
  },
  {
    role: "ai",
    text: "Vinamilk (VNM) ghi nhận doanh thu thuần **29.847 tỷ đồng** trong Q4/2024, tăng 8,3% YoY. Biên lợi nhuận gộp cải thiện lên **44,2%** nhờ giá nguyên liệu giảm. ROE đạt **21,4%** — thuộc top ngành.",
    metrics: [
      { label: "Doanh thu", value: "29.847 tỷ", trend: "up" as const },
      { label: "Biên gộp", value: "44,2%", trend: "up" as const },
      { label: "ROE", value: "21,4%", trend: "up" as const },
    ],
  },
  {
    role: "user",
    text: "Rủi ro nào cần lưu ý?",
  },
  {
    role: "ai",
    text: "Rủi ro chính: biến động tỷ giá ảnh hưởng chi phí nhập khẩu và nợ vay ngắn hạn tăng 12% so với đầu năm.",
    metrics: [
      { label: "Nợ ngắn hạn", value: "+12%", trend: "down" as const },
      { label: "Rủi ro FX", value: "Trung bình", trend: "neutral" as const },
    ],
  },
];

const FEATURE_CHIPS = [
  { icon: <BarChart3 size={12} />, label: "Phân tích Báo cáo Tài chính" },
  { icon: <Sparkles size={12} />, label: "AI Insights Thời gian thực" },
  { icon: <ShieldCheck size={12} />, label: "Dữ liệu Bảo mật & Tin cậy" },
];

/* ─────────────────────────── Sub-components ─────────────────────────── */
function MetricChip({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
}) {
  const colors = {
    up: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    down: "bg-rose-500/15 text-rose-300 border-rose-500/20",
    neutral: "bg-blue-400/15 text-blue-300 border-blue-400/20",
  };
  const Icon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : BarChart3;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${colors[trend]}`}
    >
      <Icon size={9} />
      <span className="opacity-75">{label}</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}

function ChatMessage({
  msg,
  index,
}: {
  msg: (typeof CHAT_MESSAGES)[0];
  index: number;
}) {
  const isAI = msg.role === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.12, duration: 0.35, ease: "easeOut" }}
      className={`flex gap-2 ${isAI ? "" : "justify-end"}`}
    >
      {isAI && (
        <div className="w-6 h-6 rounded-md bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={12} className="text-blue-300" />
        </div>
      )}
      <div className={`max-w-[85%]`}>
        <div
          className={`rounded-xl px-3 py-2 text-[11.5px] leading-relaxed ${
            isAI
              ? "bg-white/8 border border-white/10 text-slate-200 rounded-tl-sm"
              : "bg-blue-500 text-white rounded-tr-sm"
          }`}
        >
          {isAI ? (
            <span
              dangerouslySetInnerHTML={{
                __html: msg.text.replace(
                  /\*\*(.+?)\*\*/g,
                  '<strong class="text-white font-semibold">$1</strong>'
                ),
              }}
            />
          ) : (
            msg.text
          )}
        </div>
        {isAI && msg.metrics && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {msg.metrics.map((m) => (
              <MetricChip key={m.label} {...m} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────── Main Component ─────────────────────────── */
export function LoginScreen() {
  const { setIsAuthenticated, setCurrentPage, setUser, setToken } =
    useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      setCurrentPage("dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0f1e]">
      {/* ── Left Panel ── */}
      <div className="relative flex w-full items-center justify-center bg-[#f8fafc] px-8 py-6 lg:w-[46%]">
        {/* Dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[380px]"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.35 }}
            className="mb-5 flex flex-col items-start"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  boxShadow: "0 6px 20px rgba(37,99,235,0.35)",
                }}
              >
                <TrendingUp size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                FinSight AI
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Chào mừng trở lại
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Đăng nhập để tiếp tục phân tích tài chính thông minh
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60"
          >
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    aria-live="polite"
                    className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    <span className="shrink-0 text-red-500">✕</span>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 accent-blue-600" />
                  Ghi nhớ đăng nhập
                </label>
                <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Quên mật khẩu?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading ? "#60a5fa" : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.4)",
                }}
              >
                <span className="absolute inset-0 bg-white/0 transition-colors duration-200 group-hover:bg-white/8" />
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" />Đang đăng nhập...</>
                ) : (
                  <><LogIn size={15} />Đăng nhập</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Register link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center text-sm text-slate-500"
          >
            Chưa có tài khoản?{" "}
            <button
              onClick={() => setCurrentPage("register")}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Đăng ký miễn phí
            </button>
          </motion.p>
        </motion.div>
      </div>

      {/* ── Right Panel ── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-[54%] lg:flex-col"
        style={{
          background: "linear-gradient(145deg, #0d1b3e 0%, #0a0f1e 40%, #0f1e3c 70%, #0a1428 100%)",
        }}
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
        </div>
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-center px-10 py-8">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="mb-5"
          >
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-medium text-blue-300">
              <Sparkles size={11} />
              AI-Powered Financial Intelligence
            </div>
            <h2 className="text-2xl font-bold leading-snug text-white">
              Phân tích Báo cáo Tài chính
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                bằng Trí tuệ Nhân tạo
              </span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Đặt câu hỏi, nhận phân tích sâu. FinSight AI đọc hiểu báo cáo tài chính và trả lời ngay lập tức.
            </p>
          </motion.div>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.35 }}
            className="mb-4 flex flex-wrap gap-1.5"
          >
            {FEATURE_CHIPS.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] font-medium text-slate-300"
              >
                <span className="text-blue-400">{chip.icon}</span>
                {chip.label}
              </span>
            ))}
          </motion.div>

          {/* Chat UI Card */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.32, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
          >
            {/* Chat header */}
            <div className="flex items-center gap-2.5 border-b border-white/8 px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-400/30">
                <Bot size={13} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">FinSight AI</p>
                <p className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Sẵn sàng phân tích
                </p>
              </div>
              <div className="ml-auto flex gap-1.5">
                {["bg-red-500/60", "bg-yellow-500/60", "bg-green-500/60"].map((c) => (
                  <span key={c} className={`h-2 w-2 rounded-full ${c}`} />
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-3 px-4 py-4">
              {CHAT_MESSAGES.map((msg, i) => (
                <ChatMessage key={i} msg={msg} index={i} />
              ))}
              {/* Typing indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/20 border border-blue-400/30 shrink-0">
                  <Bot size={12} className="text-blue-300" />
                </div>
                <div className="rounded-xl rounded-tl-sm border border-white/10 bg-white/8 px-3 py-2">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1 w-1 rounded-full bg-blue-400"
                        style={{ animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
                      />
                    ))}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Input area */}
            <div className="border-t border-white/8 px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-3 py-2">
                <span className="flex-1 text-[11.5px] text-slate-500">
                  Hỏi về doanh thu, lợi nhuận, dòng tiền...
                </span>
                <button className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors">
                  <ChevronRight size={12} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-center gap-5"
          >
            {["5,000+ báo cáo đã phân tích", "Độ chính xác 98,7%", "Dữ liệu mã hóa AES-256"].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-[10.5px] text-slate-500">
                <CheckCircle2 size={10} className="text-emerald-500" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
