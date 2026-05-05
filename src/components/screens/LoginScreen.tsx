"use client";

import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { TrendingUp, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function LoginScreen() {
  const { setIsAuthenticated, setCurrentPage, setUser, setToken } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
      }

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-200"
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mb-4"
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
          >
            <TrendingUp size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">FinSight AI</h1>
          <p className="text-sm text-slate-500 mt-1">
            Nền tảng phân tích tài chính thông minh
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="text-slate-600">Ghi nhớ đăng nhập</span>
            </label>
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">
              Quên mật khẩu?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors mt-2 disabled:bg-blue-400"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />} 
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => setCurrentPage("register")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Đăng ký ngay
          </button>
        </div>
      </motion.div>
    </div>
  );
}
