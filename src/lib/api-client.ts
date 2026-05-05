import { useAppStore } from "@/store/appStore";

const getHeaders = () => {
  const token = useAppStore.getState().token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function fetcher(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }
  return data;
}

export const apiClient = {
  chat: {
    list: () => fetcher("/api/chat"),
    create: (data: { title?: string; company?: string; docSet?: string }) =>
      fetcher("/api/chat", { method: "POST", body: JSON.stringify(data) }),
    get: (id: string) => fetcher(`/api/chat/${id}`),
    send: (id: string, data: { content: string; role?: string }) =>
      fetcher(`/api/chat/${id}`, { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => fetcher(`/api/chat/${id}`, { method: "DELETE" }),
  },
  documents: {
    list: (params?: { company?: string; year?: number }) => {
      const query = params ? "?" + new URLSearchParams(params as any).toString() : "";
      return fetcher(`/api/documents${query}`);
    },
    upload: async (formData: FormData) => {
      const token = useAppStore.getState().token;
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData, // FormData automatically sets the correct Content-Type with boundary
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      return data;
    },
    get: (id: string) => fetcher(`/api/documents/${id}`),
    delete: (id: string) => fetcher(`/api/documents/${id}`, { method: "DELETE" }),
    status: (id: string) => fetcher(`/api/documents/${id}/status`),
  },
  prompts: {
    list: (category?: string) => {
      const query = category ? `?category=${category}` : "";
      return fetcher(`/api/prompts${query}`);
    },
    create: (data: any) => fetcher("/api/prompts", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetcher(`/api/prompts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetcher(`/api/prompts/${id}`, { method: "DELETE" }),
  },
  reports: {
    list: (company?: string) => {
      const query = company ? `?company=${company}` : "";
      return fetcher(`/api/reports${query}`);
    },
    create: (data: any) => fetcher("/api/reports", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetcher(`/api/reports/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetcher(`/api/reports/${id}`, { method: "DELETE" }),
  },
};
