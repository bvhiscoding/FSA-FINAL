"use client";

import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import {
  TrendingUp,
  Mail,
  Lock,
  User,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  Bot,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  FileText,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────── Right-panel mock data ─────────────────────────── */
const DEMO_CARDS = [
  {
    label: "Báo cáo đã xử lý",
    value: "5,248",
    sub: "+183 tuần này",
    color: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/20",
    icon: <FileText size={14} className="text-blue-400" />,
  },
  {
    label: "Độ chính xác AI",
    value: "98.7%",
    sub: "So với chuyên gia",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    icon: <CheckCircle2 size={14} className="text-emerald-400" />,
  },
  {
    label: "Tốc độ phân tích",
    value: "< 3s",
    sub: "Mỗi báo cáo",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    icon: <Zap size={14} className="text-violet-400" />,
  },
];

const DEMO_INSIGHTS = [
  {
    company: "HPG",
    metric: "Biên EBITDA",
    value: "18,4%",
    change: "+2,1 pp",
    comment: "Cải thiện nhờ tối ưu chi phí than cốc",
  },
  {
    company: "MSN",
    metric: "Nợ/EBITDA",
    value: "3,2x",
    change: "-0,4x",
    comment: "Giảm đòn bẩy theo kế hoạch",
  },
  {
    company: "FPT",
    metric: "Doanh thu IT",
    value: "12.340 tỷ",
    change: "+22%",
    comment: "Xuất khẩu phần mềm tăng mạnh",
  },
];

const FEATURE_CHIPS = [
  { icon: <BarChart3 size={12} />, label: "So sánh nhiều doanh nghiệp" },
  { icon: <Sparkles size={12} />, label: "Tổng hợp tự động" },
  { icon: <ShieldCheck size={12} />, label: "An toàn & Bảo mật" },
];

/* ─────────────────────────── Main Component ─────────────────────────── */
export function RegisterScreen() {
  const { setIsAuthenticated, setCurrentPage, setUser, setToken } =
    useAppStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng ký thất bại");
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
            backgroundImage: "radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)",
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
              Tạo tài khoản miễn phí
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Bắt đầu phân tích tài chính thông minh ngay hôm nay
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60"
          >
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="register-name" className="block text-sm font-medium text-slate-700">
                  Họ và tên
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="register-email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="register-email"
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
                <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                    aria-required="true"
                    aria-describedby="pw-hint"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p id="pw-hint" className="text-[11px] text-slate-400">
                  Ít nhất 6 ký tự, nên bao gồm số và ký tự đặc biệt
                </p>
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

              {/* Terms */}
              <p className="text-[11px] leading-relaxed text-slate-400">
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <button type="button" className="text-blue-500 hover:underline">Điều khoản dịch vụ</button>{" "}
                và{" "}
                <button type="button" className="text-blue-500 hover:underline">Chính sách bảo mật</button>.
              </p>

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
                  <><Loader2 size={15} className="animate-spin" />Đang tạo tài khoản...</>
                ) : (
                  <><UserPlus size={15} />Đăng ký miễn phí</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Login link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center text-sm text-slate-500"
          >
            Đã có tài khoản?{" "}
            <button
              onClick={() => setCurrentPage("login")}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Đăng nhập
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
            style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
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
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium text-indigo-300">
              <Sparkles size={11} />
              Bắt đầu hoàn toàn miễn phí
            </div>
            <h2 className="text-2xl font-bold leading-snug text-white">
              Tất cả công cụ bạn cần
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                trong một nền tảng
              </span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Phân tích, so sánh, và hiểu sâu báo cáo tài chính doanh nghiệp chỉ trong vài giây.
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
                <span className="text-indigo-400">{chip.icon}</span>
                {chip.label}
              </span>
            ))}
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.4 }}
            className="mb-4 grid grid-cols-3 gap-3"
          >
            {DEMO_CARDS.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.35 }}
                className={`rounded-xl border ${card.border} bg-gradient-to-br ${card.color} p-3`}
              >
                <div className="mb-1.5">{card.icon}</div>
                <p className="text-lg font-bold tabular-nums text-white">{card.value}</p>
                <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">{card.label}</p>
                <p className="mt-0.5 text-[10px] text-emerald-400">{card.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* AI Insights table */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
          >
            {/* Table header */}
            <div className="flex items-center gap-2.5 border-b border-white/8 px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-400/30">
                <BarChart3 size={13} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">AI Insight — Q4 2024</p>
                <p className="text-[10px] text-slate-500">Phân tích tự động 3 doanh nghiệp</p>
              </div>
              <div className="ml-auto">
                <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                  Live
                </span>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/6">
              {DEMO_INSIGHTS.map((row, i) => (
                <motion.div
                  key={row.company}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.08, duration: 0.3 }}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/8 text-[10px] font-bold text-white">
                    {row.company}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-white">{row.metric}</p>
                    <p className="truncate text-[10.5px] text-slate-500">{row.comment}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold tabular-nums text-white">{row.value}</p>
                    <p className="text-[10.5px] font-medium text-emerald-400">{row.change}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Fake input */}
            <div className="border-t border-white/8 px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-3 py-2">
                <Bot size={12} className="text-indigo-400 shrink-0" />
                <span className="flex-1 text-[11.5px] text-slate-500">Tải lên báo cáo PDF để phân tích...</span>
                <button className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors">
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
            {["Miễn phí 30 ngày", "Không cần thẻ tín dụng", "Hủy bất kỳ lúc nào"].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-[10.5px] text-slate-500">
                <CheckCircle2 size={10} className="text-emerald-500" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
