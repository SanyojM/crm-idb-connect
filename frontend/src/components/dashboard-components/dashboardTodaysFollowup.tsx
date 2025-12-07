"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Spinner,
  Chip,
  ScrollShadow,
} from "@heroui/react";
import { CalendarIcon, Clock, User, Mail } from "lucide-react";

import { useFollowupStore, type Followup } from "@/stores/useFollowupStore";
import { useAuthStore } from "@/stores/useAuthStore";

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD
};

export default function DashboardTodaysFollowUps() {
  const { user } = useAuthStore();
  const { followups, loading, fetchAllFollowups } = useFollowupStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        await fetchAllFollowups({ userId: user.id, date: getTodayDate() });
      } finally {
        setIsInitialized(true);
      }
    };

    void load();
  }, [user?.id, fetchAllFollowups]);

  const pendingFollowups = useMemo(
    () => followups.filter((f) => !f.completed),
    [followups]
  );

  const completedFollowups = useMemo(
    () => followups.filter((f) => f.completed),
    [followups]
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderEmptyState = (message: string) => (
    <div className="pt-6 text-center text-sm text-gray-400">{message}</div>
  );

  const renderFollowupRow = (followup: Followup) => (
    <div
      key={followup.id}
      className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-3 text-left shadow-sm transition-colors hover:bg-gray-50"
    >
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">
          {followup.title}
        </p>

        <div className="mt-1 space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-gray-400" />
            <span className="truncate">
              {followup.leads?.name || "Unknown lead"}
            </span>
          </div>
          {followup.leads?.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              <span className="truncate">{followup.leads.email}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(followup.due_date)}</span>
        </div>
        <Chip
          size="sm"
          variant="flat"
          color={followup.completed ? "success" : "warning"}
          className="text-[0.7rem]"
        >
          {followup.completed ? "Completed" : "Pending"}
        </Chip>
      </div>
    </div>
  );

  const pendingTitle = `Pending (${pendingFollowups.length})`;
  const completedTitle = `Completed (${completedFollowups.length})`;

  return (
    <Card radius="lg" className="border border-gray-200 shadow-sm">
      <CardBody className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Today&apos;s Follow Ups</h2>
        </div>

        {/* Loading state for initial fetch */}
        {loading && !isInitialized ? (
          <div className="flex justify-center py-6">
            <Spinner size="sm" />
          </div>
        ) : (
          <Tabs
            aria-label="today-follow-ups"
            variant="underlined"
            selectedKey={activeTab}
            onSelectionChange={(key) =>
              setActiveTab(key as "pending" | "completed")
            }
          >
            <Tab key="pending" title={pendingTitle}>
              {loading && isInitialized ? (
                <div className="flex justify-center py-6">
                  <Spinner size="sm" />
                </div>
              ) : pendingFollowups.length === 0 ? (
                renderEmptyState("Nothing pending for today.")
              ) : (
                <ScrollShadow className="mt-3 space-y-3 max-h-72">
                  {pendingFollowups.map(renderFollowupRow)}
                </ScrollShadow>
              )}
            </Tab>

            <Tab key="completed" title={completedTitle}>
              {loading && isInitialized ? (
                <div className="flex justify-center py-6">
                  <Spinner size="sm" />
                </div>
              ) : completedFollowups.length === 0 ? (
                renderEmptyState("No follow ups completed today.")
              ) : (
                <ScrollShadow className="mt-3 space-y-3 max-h-72">
                  {completedFollowups.map(renderFollowupRow)}
                </ScrollShadow>
              )}
            </Tab>
          </Tabs>
        )}
      </CardBody>
    </Card>
  );
}
