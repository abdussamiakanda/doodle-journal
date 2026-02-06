import { DateKey, JournalEntry, DoodleId } from "@/types";

interface EntriesResponse {
  entries: Record<DateKey, JournalEntry>;
  usedDoodleIds: DoodleId[];
}

interface ApiUser {
  id: number;
  username: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as T;
}

export const api = {
  async getEntries(year: number): Promise<EntriesResponse> {
    return apiFetch<EntriesResponse>(`/api/entries?year=${year}`);
  },

  async createEntry(dateKey: DateKey, text: string): Promise<JournalEntry> {
    const data = await apiFetch<{ entry: JournalEntry }>("/api/entries", {
      method: "POST",
      body: JSON.stringify({ dateKey, text }),
    });
    return data.entry;
  },

  async updateEntry(dateKey: DateKey, text: string): Promise<JournalEntry> {
    const data = await apiFetch<{ entry: JournalEntry }>(
      `/api/entries/${dateKey}`,
      {
        method: "PUT",
        body: JSON.stringify({ text }),
      }
    );
    return data.entry;
  },

  async getMe(): Promise<ApiUser | null> {
    try {
      const data = await apiFetch<{ user: ApiUser | null }>("/api/auth/me");
      return data.user;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await apiFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
  },
};
