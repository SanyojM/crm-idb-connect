// store/announcements.ts
import { create } from "zustand";
import api from "@/lib/api";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: "user" | "branch";
  branch_id?: string | null;
  users?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  is_read?: boolean;
}

interface AnnouncementState {
  announcements: Announcement[];
  unreadCount: number;
  loading: boolean;
  error: string | null;

  fetchAnnouncements: (params?: {
    target_audience?: string;
    branch_id?: string;
  }) => Promise<void>;
  createAnnouncement: (payload: Partial<Announcement>) => Promise<Announcement>;
  updateAnnouncement: (
    id: string,
    updates: Partial<Announcement>
  ) => Promise<Announcement>;
  deleteAnnouncement: (id: string) => Promise<void>;
  markRead: (id: string) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;

  setAnnouncements: (data: Announcement[]) => void;
  setUnreadCount: (count: number) => void;
}

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
  announcements: [],
  unreadCount: 0,
  loading: false,
  error: null,

  setAnnouncements: (data) => set({ announcements: data }),
  setUnreadCount: (count) => set({ unreadCount: count }),

  fetchAnnouncements: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await api.AnnouncementsAPI.fetchAnnouncements(params);
      set({ announcements: (data || []) as Announcement[], loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? "Failed to fetch announcements",
      });
      throw err;
    }
  },

  createAnnouncement: async (payload) => {
    set({ loading: true, error: null });
    try {
      const created = await api.AnnouncementsAPI.createAnnouncement(payload);
      set({ announcements: [created, ...get().announcements], loading: false });
      return created;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? "Failed to create announcement",
      });
      throw err;
    }
  },

  updateAnnouncement: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await api.AnnouncementsAPI.updateAnnouncement(
        id,
        updates
      );
      set({
        announcements: get().announcements.map((a) =>
          a.id === id ? { ...a, ...updated } : a
        ),
        loading: false,
      });
      return updated;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? "Failed to update announcement",
      });
      throw err;
    }
  },

  deleteAnnouncement: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.AnnouncementsAPI.deleteAnnouncement(id);
      set({
        announcements: get().announcements.filter((a) => a.id !== id),
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? "Failed to delete announcement",
      });
      throw err;
    }
  },

  markRead: async (id) => {
    try {
      await api.AnnouncementsAPI.markRead(id);
      set({
        announcements: get().announcements.map((a) =>
          a.id === id ? { ...a, is_read: true } : a
        ),
        unreadCount: Math.max(0, get().unreadCount - 1),
      });
    } catch (err) {
      console.error("markRead error:", err);
      throw err;
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await api.AnnouncementsAPI.getUnreadCount();
      set({ unreadCount: res?.count ?? 0 });
    } catch (err) {
      console.error("fetchUnreadCount error:", err);
    }
  },
}));
