"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Bell, Megaphone } from "lucide-react";
import { format } from "date-fns";
import { AnnouncementsAPI } from "@/lib/api";

const LAST_SEEN_KEY = "b2b_notifications_last_seen";

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  partners?: { id?: string; name?: string; email?: string } | null;
}

function getLastSeen(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_SEEN_KEY);
  } catch {
    return null;
  }
}

function setLastSeen(iso: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_SEEN_KEY, iso);
  } catch {
    // ignore (private mode / quota)
  }
}

export default function NotificationBell() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeenState] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch on mount. Never crash the header — catch and show empty.
  useEffect(() => {
    let active = true;
    setLastSeenState(getLastSeen());

    (async () => {
      try {
        const data = await AnnouncementsAPI.getB2B();
        if (!active) return;
        const list: Announcement[] = Array.isArray(data) ? data : data?.data ?? [];
        setAnnouncements(list);
        setError(false);
      } catch {
        if (!active) return;
        setError(true);
        setAnnouncements([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Close dropdown on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // unreadCount: announcements newer than lastSeen. No lastSeen => all unread.
  const unreadCount = useMemo(() => {
    if (!lastSeen) return announcements.length;
    const seenTime = new Date(lastSeen).getTime();
    return announcements.filter((a) => {
      const t = new Date(a.created_at).getTime();
      return !Number.isNaN(t) && t > seenTime;
    }).length;
  }, [announcements, lastSeen]);

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      // Opening marks everything seen -> dot clears immediately from state.
      if (next) {
        const now = new Date().toISOString();
        setLastSeen(now);
        setLastSeenState(now);
      }
      return next;
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Just now";
    return format(d, "MMM d, p");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative bg-transparent border-0 p-0 leading-none"
      >
        <Bell className="w-6 h-6 stroke-[1.25px] cursor-pointer hover:text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[350px] max-w-[90vw] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
            ) : announcements.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No notifications yet
              </div>
            ) : (
              announcements.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-1 p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-blue-100 shrink-0">
                      <Megaphone size={14} className="text-blue-600" />
                    </div>
                    <span className="font-semibold text-sm line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 pl-8">
                    {item.content}
                  </p>
                  <div className="flex items-center justify-between pl-8">
                    <span className="text-[10px] text-gray-400">
                      {formatDate(item.created_at)}
                    </span>
                    {item.partners?.name && (
                      <span className="text-[10px] text-gray-400">
                        {item.partners.name}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
