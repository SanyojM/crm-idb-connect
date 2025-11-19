"use client";

import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Input,
    Textarea,
    Button,
    Switch,
} from "@heroui/react";

import { Announcement, useAnnouncementStore } from "@/stores/useAnnouncementStore";
import AudienceToggle from "./audienceToggle";
import PartnerMultiSelect  from "./partnerMultiSelect";

type Props = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mode: "create" | "edit";
    announcement?: Announcement | null;
    onCompleted?: (a: Announcement) => void;
};

export default function AnnouncementDrawer({
    isOpen,
    onOpenChange,
    mode,
    announcement,
    onCompleted,
}: Props) {
    const { createAnnouncement, updateAnnouncement } = useAnnouncementStore();

    const [audience, setAudience] = useState<"user" | "branch">("user");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [publishNow, setPublishNow] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEditMode = mode === "edit";

    useEffect(() => {
        if (isEditMode && announcement) {
            setAudience(announcement.target_audience);
            setSelectedUsers(announcement.users || []);
            setTitle(announcement.title);
            setContent(announcement.content);
            setPublishNow(Boolean(announcement.is_active));
        } else {
            resetForm();
        }
    }, [isEditMode, announcement, isOpen]);

    const resetForm = () => {
        setAudience("user");
        setSelectedUsers([]);
        setTitle("");
        setContent("");
        setPublishNow(true);
        setError("");
    };

    const validate = () => {
        if (!title.trim()) return "Title is required";
        if (!content.trim()) return "Message is required";
        if (audience === "user" && selectedUsers.length === 0) {
            return "Select at least one user";
        }
        return "";
    };

    const handleSubmit = async (onClose: () => void) => {
        const v = validate();
        if (v) return setError(v);

        setLoading(true);

        try {
            const payload: Partial<Announcement> = {
                title: title.trim(),
                content: content.trim(),
                target_audience: audience,
                users: audience === "user" ? selectedUsers : undefined,
                branch_id: audience === "branch" ? null : undefined,
                is_active: publishNow,
            };

            let result: Announcement;

            if (isEditMode && announcement) {
                result = await updateAnnouncement(announcement.id, payload);
            } else {
                result = await createAnnouncement(payload);
            }

            onCompleted?.(result);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="sm:max-w-xl max-h-screen overflow-y-auto bg-background">
                {(onClose) => (
                    <>
                        <DrawerHeader className="px-6 pt-6 pb-3 border-b">
                            <div className="text-xl font-semibold">
                                {isEditMode ? "Edit Announcement" : "Create Announcement"}
                            </div>
                        </DrawerHeader>

                        <DrawerBody className="px-6 py-6 space-y-6">
                            <AudienceToggle value={audience} onChange={setAudience} />

                            {audience === "branch" && (
                                <div className="p-4 border rounded text-sm text-gray-500">
                                    Branch selection is disabled for now.
                                </div>
                            )}

                            <PartnerMultiSelect
                                value={selectedUsers}
                                onChange={setSelectedUsers}
                                disabled={audience === "branch"}
                            />

                            <Input
                                label="Title"
                                placeholder="Announcement title"
                                value={title}
                                onChange={(e: any) => setTitle(e.target.value)}
                            />

                            <Textarea
                                label="Message"
                                rows={8}
                                placeholder="Write announcement message..."
                                value={content}
                                onChange={(e: any) => setContent(e.target.value)}
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm">Publish Now</span>
                                    <Switch checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} />
                                </div>
                                <span className="text-sm text-gray-500">
                                    {publishNow ? "Immediately visible" : "Saved as draft"}
                                </span>
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}
                        </DrawerBody>

                        <DrawerFooter className="px-6 py-4 border-t bg-background">
                            <div className="flex w-full justify-end gap-3">
                                <Button variant="light" onPress={onClose} isDisabled={loading}>
                                    Cancel
                                </Button>

                                <Button
                                    color="primary"
                                    className="text-white"
                                    onPress={() => handleSubmit(onClose)}
                                    isLoading={loading}
                                >
                                    {loading
                                        ? isEditMode
                                            ? "Saving..."
                                            : "Creating..."
                                        : isEditMode
                                            ? "Save Changes"
                                            : "Create Announcement"}
                                </Button>
                            </div>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
