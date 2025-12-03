import React, { useEffect, useMemo } from "react";

import { useOfflinePaymentStore } from "@/stores/useOfflinePaymentStore";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { COLORS } from "@/lib/color";
import { Card, CardBody } from "@heroui/react";


function formatCurrency(amount?: number, currency = "INR") {
    if (amount == null) return "-";
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
    } catch (e) {
        return `${currency} ${amount.toFixed(2)}`;
    }
}

function toISODateString(d?: string | Date) {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toISOString().split("T")[0];
}

export default function PaymentsDashboardClean() {
    const fetchAllPayments = useOfflinePaymentStore((s) => s.fetchAllPayments);
    const allPayments = useOfflinePaymentStore((s) => s.allPayments);
    const loading = useOfflinePaymentStore((s) => s.loading);

    useEffect(() => {
        fetchAllPayments().catch((e: unknown) => console.error(e));
    }, [fetchAllPayments]);

    // Derived metrics (memoized)
    const metrics = useMemo(() => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        let totalReceived = 0;
        let totalPending = 0;
        let failed = 0;
        let revenueThisMonth = 0;

        for (const p of allPayments) {
            const amt = p.amount ?? 0;
            const created = p.created_at ? new Date(p.created_at).getTime() : 0;
            if (p.status === "success") {
                totalReceived += amt;
                if (created >= monthStart) revenueThisMonth += amt;
            } else if (p.status === "pending") {
                totalPending += amt;
            } else if (p.status === "failed" || p.status === "rejected") {
                failed += amt;
            }
        }

        return {
            totalReceived,
            totalPending,
            failed,
            totalPayments: allPayments.length,
            revenueThisMonth,
        };
    }, [allPayments]);

    // Chart: Revenue over last 30 days
    const revenueSeries = useMemo(() => {
        const map = new Map<string, number>();
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
            map.set(toISODateString(d), 0);
        }
        for (const p of allPayments) {
            if (!p.created_at) continue;
            const day = toISODateString(p.created_at);
            if (!map.has(day)) continue; // ignore old records
            map.set(day, (map.get(day) ?? 0) + (p.amount ?? 0));
        }
        return Array.from(map.entries()).map(([date, total]) => ({ date, total }));
    }, [allPayments]);

    // Pie: status distribution by amount
    const statusDistribution = useMemo(() => {
        const map = new Map<string, number>();
        for (const p of allPayments) {
            const key = p.status ?? "unknown";
            map.set(key, (map.get(key) ?? 0) + (p.amount ?? 0));
        }
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    }, [allPayments]);



    return (
        <div className=" space-y-6">
            {/* KPI tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                <Card className="h-24 flex items-center shadow-md">
                    <CardBody>
                        <p className="text-sm text-default-500">Total Pending Amount</p>
                        <p className="text-3xl mt-3 font-bold">
                            {formatCurrency(metrics.totalPending)}
                        </p>
                    </CardBody>
                </Card>

                <Card className="h-24 flex items-center shadow-md">
                    <CardBody>
                        <p className="text-sm text-default-500">Total Received Amount</p>
                        <p className="text-3xl mt-3 font-bold text-emerald-600">
                            {formatCurrency(metrics.totalReceived)}
                        </p>
                    </CardBody>
                </Card>

                <Card className="h-24 flex items-center shadow-md">
                    <CardBody>
                        <p className="text-sm text-default-500">Total Payments</p>
                        <p className="text-3xl mt-3 font-bold">{metrics.totalPayments}</p>
                    </CardBody>
                </Card>

                <Card className="h-24 flex items-center shadow-md">
                    <CardBody>
                        <p className="text-sm text-default-500">Revenue This Month</p>
                        <p className="text-3xl mt-3 font-bold text-indigo-600">
                            {formatCurrency(metrics.revenueThisMonth)}
                        </p>
                    </CardBody>
                </Card>
            </div>


            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Revenue (Last 30 days)</h3>
                        <div className="text-xs text-slate-500">Amounts shown in transaction currency</div>
                    </div>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer>
                            <LineChart data={revenueSeries}>
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Line type="monotone" dataKey="total" stroke={COLORS[0]} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium mb-2">Status Distribution</h3>
                    {statusDistribution.length > 0 && (<div style={{ height: 260 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={statusDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                                    {statusDistribution.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>) || (<p className="text-center">No payment data available.</p>)}
                </div>
            </div>


            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white px-6 py-4 rounded shadow">Loading payments...</div>
                </div>
            )}
        </div>
    );
}
