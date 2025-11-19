"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Tabs, Tab, Card, Badge } from "@heroui/react";
import AnnouncementList from "@/components/announcement-components/announcementList";
import { Announcement, useAnnouncementStore } from "@/stores/useAnnouncementStore";
import AnnouncementDrawer from "@/components/announcement-components/announcementDrawer";
import { Bell } from "lucide-react";

export default function AnnouncementsPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [editOpen, setEditOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);


    const { announcements, unreadCount, fetchUnreadCount, fetchAnnouncements } =
        useAnnouncementStore();

    useEffect(() => {
        fetchAnnouncements().catch(() => { });
        fetchUnreadCount().catch(() => { });
    }, []);

    const filteredAnnouncements = useMemo(() => {
        switch (activeTab) {
            case "published":
                return announcements.filter((a) => a.is_active);
            case "draft":
                return announcements.filter((a) => !a.is_active);
            default:
                return announcements;
        }
    }, [activeTab, announcements]);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="flex items-center justify-between p-6">
                <h1 className="text-2xl font-bold">Announcements</h1>

                <div className="flex items-center gap-4">
                    <Input placeholder="Search…" className="w-80" />

                    <Button color="secondary" onPress={() => setIsDrawerOpen(true)} className="text-white">
                        Create
                    </Button>

                    <Badge
                        content={unreadCount > 9 ? "9+" : unreadCount}
                        color="danger"
                        shape="circle"
                        placement="top-right"
                        isInvisible={unreadCount === 0}
                    >

                        <Button
                            isIconOnly
                            radius="full"
                            variant="flat"
                            className="bg-white shadow-sm hover:shadow-md transition-all"
                        >
                            <Bell className="w-5 h-5 text-gray-700" />
                        </Button>
                    </Badge>
                </div>
            </header>

            <main className="p-6">
                <Card className="p-4">
                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={(key) => setActiveTab(String(key))}
                        className="mb-4"
                    >
                        <Tab key="all" title="All" />
                        <Tab key="published" title="Published" />
                        <Tab key="draft" title="Draft" />
                    </Tabs>

                    <AnnouncementList
                        filtered={filteredAnnouncements}
                        onEdit={(a) => {
                            setEditingAnnouncement(a);
                            setEditOpen(true);
                        }}
                    />
                </Card>
            </main>

            <AnnouncementDrawer
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                mode="create"
                onCompleted={() => fetchAnnouncements()}
            />
            <AnnouncementDrawer
                isOpen={editOpen}
                mode="edit"
                announcement={editingAnnouncement}
                onOpenChange={setEditOpen}
                onCompleted={() => fetchAnnouncements()}
            />
        </div>
    );
}
