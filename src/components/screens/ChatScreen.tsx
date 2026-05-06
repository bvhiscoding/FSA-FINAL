"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Sparkles,
  FileText,
  Zap,
} from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";
import { ChatMessage } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAppStore } from "@/store/appStore";

const generateId = () => Date.now().toString();
const getNow = () => new Date();

function ChangeIndicator({ value }: { value: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded",
        value > 0
          ? "bg-growth"
          : value < 0
            ? "bg-decline"
            : "bg-slate-100 text-slate-600",
      )}
    >
      {value > 0 ? "▲" : value < 0 ? "▼" : "—"}
      {formatPercent(Math.abs(value))}
    </span>
  );
}

function AssistantMessage({ message }: { message: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3"
    >
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
        >
          <Sparkles size={12} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] font-semibold text-slate-700">
            FinSight AI
          </span>
          <span suppressHydrationWarning className="text-[11px] text-slate-400">
            {message.timestamp.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.sources && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              <FileText size={9} />
              {message.sources.length} nguồn
            </span>
          )}
        </div>

        {/* Metrics pills */}
        {message.metrics && (
          <div className="flex flex-wrap gap-2 mb-3">
            {message.metrics.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm"
              >
                <div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {m.label}
                  </div>
                  <div className="text-[13px] font-semibold text-slate-800 tabular-nums">
                    {m.value}
                  </div>
                </div>
                {m.change !== undefined && <ChangeIndicator value={m.change} />}
              </div>
            ))}
          </div>
        )}

        {/* Prose content */}
        <div className="prose-financial space-y-1">
          <AssistantMarkdown content={message.content} />
        </div>
      </div>
    </motion.div>
  );
}

function AssistantMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ ...props }) => (
            <div className="overflow-x-auto rounded-lg border border-slate-200 mt-2">
              <table className="prose-financial w-full" {...props} />
            </div>
          ),
          th: ({ ...props }) => <th {...props} />,
          td: ({ ...props }) => {
            // Check if content has + or - to apply styling
            const childText = Array.isArray(props.children) 
              ? props.children.join('') 
              : String(props.children || '');
            
            const isGrowth = childText.includes('+');
            const isDecline = childText.includes('-');
            
            return (
              <td
                className={cn(
                  isGrowth ? "text-growth font-semibold tabular-nums" : "",
                  isDecline ? "text-decline font-semibold tabular-nums" : "",
                  !isGrowth && !isDecline && !isNaN(Number(childText.replace(/[,\.%]/g, ''))) ? "tabular-nums" : ""
                )}
                {...props}
              />
            );
          },
          p: ({ ...props }) => <p className="text-sm text-slate-700 leading-relaxed" {...props} />,
          h4: ({ ...props }) => (
            <div className="flex items-center gap-2 mt-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                {props.children}
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
          ),
          ul: ({ ...props }) => <ul className="space-y-1 ml-4" {...props} />,
          li: ({ ...props }) => (
            <li className="text-sm text-slate-700 list-disc marker:text-blue-400">
              {props.children}
            </li>
          ),
          strong: ({ ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3 justify-end"
    >
      <div className="max-w-[70%]">
        <div className="flex items-center gap-2 mb-1 justify-end">
          <span suppressHydrationWarning className="text-[11px] text-slate-400">
            {message.timestamp.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="text-[12px] font-semibold text-slate-600">Bạn</span>
        </div>
        <div
          className="text-sm text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm"
          style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
        >
          {message.content}
        </div>
      </div>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-5"
        style={{ background: "linear-gradient(135deg, #475569, #334155)" }}
      >
        NP
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex gap-3"
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
        style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
      >
        <Sparkles size={12} className="text-white" />
      </div>
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
        {[0, 0.15, 0.3].map((delay, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-blue-400"
            style={{ animation: `pulse-dot 1.2s ${delay}s infinite` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

const suggestedPrompts = [
  "Phân tích chi phí G&A tăng 57.6%",
  "Tại sao tiền mặt giảm 56.7%?",
  "Đánh giá rủi ro dự án CIP 790 tỷ",
  "So sánh biên lợi nhuận 2023 vs 2024",
];

interface ChatSession {
  id: string;
  title: string | null;
  company: string;
  docSet: string;
  updatedAt: string;
}

function toChatMessage(message: any): ChatMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    timestamp: new Date(message.timestamp || message.createdAt),
    sources: message.sources || [],
    metrics: message.metrics || [],
  };
}

export function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("/api/models");
        const data = await res.json();
        if (data.models) {
          setModels(data.models);
          if (data.models.length > 0) {
            setSelectedModel(data.models[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch models", err);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const fetchChatSessions = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.chats) setChatSessions(data.chats);
    } catch (err) {
      console.error("Failed to fetch chat sessions", err);
    }
  };

  const loadChat = async (chatId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load chat");
      const loadedMessages = data.chat.messages.map(toChatMessage);
      const lastAssistant = [...loadedMessages].reverse().find((message) => message.role === "assistant");
      setActiveChatId(data.chat.id);
      setMessages(loadedMessages);
      setLatestSources(lastAssistant?.sources || []);
    } catch (err) {
      console.error("Failed to load chat", err);
    }
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setLatestSources([]);
  };

  const {
    token,
    selectedCompany,
    selectedDocumentSet,
    setLatestSources,
  } = useAppStore();

  useEffect(() => {
    fetchChatSessions();
  }, [token]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: msg,
      timestamp: getNow(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: msg,
          model: selectedModel,
          chatId: activeChatId,
          company: selectedCompany,
          docSet: selectedDocumentSet,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      const sources = data.sources || [];
      const aiMsg: ChatMessage = {
        id: generateId() + "-ai",
        role: "assistant",
        content: data.message.content,
        timestamp: new Date(data.message.timestamp),
        sources,
        metrics: data.metrics || [],
      };
      if (data.chat?.id) setActiveChatId(data.chat.id);
      setLatestSources(sources);
      setMessages((prev) => [...prev, aiMsg]);
      await fetchChatSessions();
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: generateId() + "-error",
        role: "assistant",
        content: "Xin lỗi, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.",
        timestamp: getNow(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Chat header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-slate-800">Chat Analyst</h1>
          <p className="text-[11px] text-slate-400">
            {selectedCompany} · {selectedDocumentSet} · {messages.length} tin nhắn
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            <Sparkles size={14} className="text-blue-600" />
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-[12px] font-medium bg-transparent border-none outline-none text-slate-700 cursor-pointer"
            >
              {models.length > 0 ? (
                models
                  .filter((m) => !m.name.includes("embedding") && !m.name.includes("bge"))
                  .map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))
              ) : (
                <option>Loading models...</option>
              )}
            </select>
          </div>
          <button className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 transition-colors px-2 py-1 rounded hover:bg-slate-100 cursor-pointer">
            <Zap size={12} /> Quick Prompts
          </button>
          <select
            value={activeChatId || ""}
            onChange={(e) => {
              if (e.target.value) loadChat(e.target.value);
            }}
            className="max-w-[180px] text-[12px] font-medium bg-slate-100 border border-slate-200 outline-none text-slate-700 rounded-lg px-2 py-1.5 cursor-pointer"
          >
            <option value="">Chat sessions</option>
            {chatSessions.map((chat) => (
              <option key={chat.id} value={chat.id}>
                {chat.title || "New Chat"}
              </option>
            ))}
          </select>
          <button
            onClick={startNewChat}
            className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 transition-colors px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <AnimatePresence>
          {messages.map((msg) =>
            msg.role === "assistant" ? (
              <AssistantMessage key={msg.id} message={msg} />
            ) : (
              <UserMessage key={msg.id} message={msg} />
            ),
          )}
          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {!isTyping && messages.length < 4 && (
        <div className="px-6 pb-3">
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-[12px] text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="shrink-0 bg-white border-t border-slate-200 px-6 py-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi về báo cáo tài chính... (Enter để gửi, Shift+Enter để xuống dòng)"
              rows={1}
              className="w-full px-4 py-3 bg-transparent text-sm text-slate-800 placeholder-slate-400 resize-none outline-none max-h-[120px]"
              style={{ lineHeight: "1.5" }}
            />
            <div className="flex items-center justify-between px-3 pb-2 border-t border-slate-100">
              <div className="flex gap-1">
                {["@doc", "#metric", "/prompt"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-slate-400 hover:text-blue-500 cursor-pointer px-1 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-slate-300">
                {input.length}/2000
              </span>
            </div>
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer",
              input.trim() && !isTyping
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
                : "bg-slate-100 text-slate-400 cursor-not-allowed",
            )}
          >
            {isTyping ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          FinSight AI có thể mắc lỗi. Hãy kiểm chứng với tài liệu gốc. RAG
          active · GPT-4o
        </p>
      </div>
    </div>
  );
}
