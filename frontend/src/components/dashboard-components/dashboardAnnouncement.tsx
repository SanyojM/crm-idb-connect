"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Spinner,
  Button,
  Chip,
} from "@heroui/react";
import { MegaphoneIcon, CheckCircle2 } from "lucide-react";
import {
  useAnnouncementStore,
  type Announcement,
} from "@/stores/useAnnouncementStore";

type TabKey = "unread" | "read";

const DashboardAnnouncement: React.FC = () => {
  const {
    announcements,
    loading,
    fetchAnnouncements,
    markAsRead,
    fetchUnreadCount,
  } = useAnnouncementStore();

  const [activeTab, setActiveTab] = useState<TabKey>("unread");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    void (async () => {
      await Promise.all([fetchAnnouncements(), fetchUnreadCount()]);
    })();
  }, []);

  const unreadAnnouncements = useMemo(
    () =>
      announcements.filter(
        (a) => !a.announcement_reads || a.announcement_reads.length === 0,
      ),
    [announcements],
  );

  const readAnnouncements = useMemo(
    () =>
      announcements.filter(
        (a) => a.announcement_reads && a.announcement_reads.length > 0,
      ),
    [announcements],
  );

  const handleMarkRead = async (announcement: Announcement) => {
    if (!announcement.id) return;

    try {
      setUpdatingId(announcement.id);
      await markAsRead(announcement.id);
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderEmptyState = (message: string) => (
    <div className="pt-6 text-center text-sm text-gray-400">{message}</div>
  );

  const renderAnnouncementRow = (
    announcement: Announcement,
    options: { isUnread: boolean },
  ) => {
    const { isUnread } = options;
    const isUpdating = updatingId === announcement.id;

    return (
      <div
        key={announcement.id}
        className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-gray-50"
      >
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {announcement.title}
          </p>
          <p className="mt-1 line-clamp-3 text-xs text-gray-500">
            {announcement.content}
          </p>
        </div>

        {isUnread ? (
          <Button
            size="sm"
            variant="solid"
            color="primary"
            radius="sm"
            className="shrink-0"
            startContent={<CheckCircle2 className="h-4 w-4" />}
            isLoading={isUpdating}
            isDisabled={isUpdating}
            onPress={() => void handleMarkRead(announcement)}
          >
            Mark as read
          </Button>
        ) : (
          <Chip
            size="sm"
            variant="flat"
            color="success"
            className="shrink-0"
          >
            Read
          </Chip>
        )}
      </div>
    );
  };

  const unreadTabTitle = (
    <div className="flex items-center gap-2">
      <span>Unread</span>
      {unreadAnnouncements.length > 0 && (
        <Chip
          size="sm"
          variant="flat"
          color="primary"
          className="h-5 min-w-[1.5rem] px-1 text-[0.7rem]"
        >
          {unreadAnnouncements.length}
        </Chip>
      )}
    </div>
  );

  const readTabTitle = <span>Read</span>;

  return (
    <Card radius="lg" className="border border-gray-200 shadow-sm">
      <CardBody className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <MegaphoneIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Announcements</h2>
          <Chip
            size="sm"
            variant="flat"
            color="primary"
            className="ml-1 text-xs"
          >
            {unreadAnnouncements.length} unread
          </Chip>
        </div>

        <Tabs
          aria-label="announcements"
          variant="underlined"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as TabKey)}
        >
          <Tab key="unread" title={unreadTabTitle}>
            {loading ? (
              <div className="flex justify-center py-6">
                <Spinner size="sm" />
              </div>
            ) : unreadAnnouncements.length === 0 ? (
              renderEmptyState("No unread announcements.")
            ) : (
              <div className="space-y-3 pt-2">
                {unreadAnnouncements.map((announcement) =>
                  renderAnnouncementRow(announcement, { isUnread: true }),
                )}
              </div>
            )}
          </Tab>

          <Tab key="read" title={readTabTitle}>
            {loading ? (
              <div className="flex justify-center py-6">
                <Spinner size="sm" />
              </div>
            ) : readAnnouncements.length === 0 ? (
              renderEmptyState("No read announcements.")
            ) : (
              <div className="space-y-3 pt-2">
                {readAnnouncements.map((announcement) =>
                  renderAnnouncementRow(announcement, { isUnread: false }),
                )}
              </div>
            )}
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default DashboardAnnouncement;
