"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Input, Card, Checkbox } from "@heroui/react"; // adjust path
import { usePartnerStore } from "@/stores/usePartnerStore";

type Props = {
    value: string[];
    onChange: (ids: string[]) => void;
    disabled?: boolean;
};

export default function PartnerMultiSelect({ value, onChange, disabled = false }: Props) {
    const partners = usePartnerStore((s) => s.partners);
    const loading = usePartnerStore((s) => s.loading);
    const fetchPartners = usePartnerStore((s) => s.fetchPartners);

    const [q, setQ] = useState("");

    useEffect(() => {
        if (partners.length === 0) fetchPartners().catch(() => { });
    }, [partners.length, fetchPartners]);

    const filtered = useMemo(() => {
        if (!q) return partners;
        const lower = q.toLowerCase();
        return partners.filter((p) => (p.name || "").toLowerCase().includes(lower) || (p.email || "").toLowerCase().includes(lower));
    }, [partners, q]);

    const toggle = (id?: string) => {
        if (!id) return;
        if (value.includes(id)) onChange(value.filter((v) => v !== id));
        else onChange([...value, id]);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium">Select Users</label>

            <Input
                value={q}
                onChange={(e: any) => setQ(e.target.value)}
                placeholder="Search users..."
                aria-label="Search users"
            />

            <Card className="max-h-56 overflow-auto p-2">
                {loading && <div className="text-sm text-gray-500">Loading partners...</div>}
                {!loading && filtered.length === 0 && <div className="text-sm text-gray-500">No users found.</div>}

                <ul className="space-y-2">
                    {filtered.map((p) => (
                        <li key={p.id} className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50">
                            <div>
                                <div className="font-medium text-sm">{p.name}</div>
                                <div className="text-xs text-gray-500">{p.email}</div>
                            </div>

                            <Checkbox checked={value.includes(p.id!)} onChange={() => toggle(p.id)} disabled={disabled} aria-label={`Select ${p.name}`} />
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};
