"use client";

import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Button,
} from "@heroui/react";
import {
    EllipsisVertical,
    MessageSquareText,
    MessageCircleCode,
    AtSign,
    Repeat,
    Replace,
    NotebookPen,
    CalendarFold,
    Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LeadActionsMenu({ leadId }: { leadId: string }) { // ✅ Accept leadId
    const router = useRouter();
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button isIconOnly variant="light" size="sm" aria-label="Lead Actions">
                    <EllipsisVertical className="h-5 w-5 text-gray-600" />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Lead Actions Menu">
                <DropdownSection title="Actions">
                    <DropdownItem key="add_lead" startContent={<Plus className="h-4 w-4 text-blue-500" />}>
                        Lead to Application
                    </DropdownItem>

                    <DropdownItem key="change_status" startContent={<Replace className="h-4 w-4 text-orange-500" />}>
                        Change Lead Status
                    </DropdownItem>

                    {/* ✅ Notes Click Navigate */}
                    <DropdownItem
                        key="notes"
                        startContent={<NotebookPen className="h-4 w-4 text-indigo-500" />}
                        onClick={() => router.push(`/leads/${leadId}?tab=notes`)}
                    >
                        Notes
                    </DropdownItem>

                    <DropdownItem key="follow_up"
                        startContent={<CalendarFold className="h-4 w-4 text-pink-500" />}
                        onClick={() => router.push(`/leads/${leadId}?tab=followups`)}>
                        Follow-up
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Communicate">
                    <DropdownItem
                        key="text"
                        startContent={<MessageSquareText className="h-4 w-4 text-blue-500" />}
                        onClick={() => router.push(`/leads/${leadId}?tab=chat`)}
                    >
                        Text Message
                    </DropdownItem>
                    <DropdownItem
                        key="whatsapp"
                        startContent={<MessageCircleCode className="h-4 w-4 text-green-500" />}
                        onClick={() => router.push(`/leads/${leadId}?tab=whatsapp`)}>
                        WhatsApp
                    </DropdownItem>
                    <DropdownItem
                        key="mail"
                        startContent={<AtSign className="h-4 w-4 text-purple-500" />}
                        onClick={() => router.push(`/leads/${leadId}?tab=emails`)}>
                        Email
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
}