"use client";

import React, { useEffect } from "react";
import {
    Card,
    Chip,
    Button,
    Divider,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";

import {
    Announcement,
    useAnnouncementStore,
} from "@/stores/useAnnouncementStore";

import {
    Trash2,
    MailOpen,
    Mail,
    Pencil,
    MoreVertical,
} from "lucide-react";

export default function AnnouncementList({
    filtered,
    onEdit,
}: {
    filtered: Announcement[];
    onEdit: (a: Announcement) => void;
}) {
    const {
        loading,
        error,
        fetchAnnouncements,
        deleteAnnouncement,
        markRead,
    } = useAnnouncementStore();

    useEffect(() => {
        fetchAnnouncements().catch(() => { });
    }, []);

    if (loading)
        return (
            <div className="p-6 text-gray-700 animate-pulse text-sm">
                Loading announcements…
            </div>
        );

    if (error)
        return <div className="p-6 text-red-600 font-medium">{error}</div>;

    if (filtered.length === 0)
        return (
            <div className="p-6 text-gray-500 font-medium">
                No announcements found.
            </div>
        );

    return (
        <div className="space-y-5 p-4">
            {filtered.map((a) => (
                <Card
                    key={a.id}
                    shadow="sm"
                    className="p-5 border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold leading-snug">{a.title}</h3>

                                {a.is_active ? (
                                    <Chip variant="solid" color="success" size="sm" className="text-white">
                                        Published
                                    </Chip>
                                ) : (
                                    <Chip variant="flat" color="warning" size="sm" className="text-warning-700">
                                        Draft
                                    </Chip>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{a.content}</p>
                        </div>

                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DropdownTrigger>

                            <DropdownMenu aria-label="Announcement actions">
                                <DropdownItem
                                    key="edit"
                                    startContent={<Pencil className="w-4 h-4 text-indigo-600" />}
                                    onPress={() => onEdit(a)}
                                >
                                    Edit
                                </DropdownItem>

                                <DropdownItem
                                    key="markRead"
                                    startContent={
                                        a.is_read ? (
                                            <MailOpen className="w-4 h-4 text-success" />
                                        ) : (
                                            <Mail className="w-4 h-4 text-gray-700" />
                                        )
                                    }
                                    onPress={() => markRead(a.id)}
                                >
                                    {a.is_read ? "Mark as Unread" : "Mark Read"}
                                </DropdownItem>

                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    startContent={<Trash2 className="w-4 h-4 text-danger" />}
                                    onPress={() => deleteAnnouncement(a.id)}
                                >
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <Divider className="my-4" />

                    <div className="flex items-center text-xs text-gray-500 gap-4">
                        <span className="font-medium">Target:</span>

                        <Chip color="secondary" variant="flat" size="sm">
                            {a.target_audience.replace(/^\w/, (c) => c.toUpperCase())}
                        </Chip>

                        {a.branch_id && (
                            <span className="text-gray-500">• Branch: {a.branch_id}</span>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
}
