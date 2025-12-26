"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { Card, CardHeader, CardBody, Skeleton } from "@heroui/react";
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { useApplicationStore } from "@/stores/useApplicationStore";
import { useLeadStore } from "@/stores/useLeadStore";
import { COLORS } from "@/lib/color";


export default function ApplicationsDashboardTab() {
    const {
        applications,
        loading,
    } = useApplicationStore();
    const fetchLeads = useLeadStore(state => state.fetchLeads);
    const leadIds = useLeadStore(state => state.leadIds);
    const fetchApplications = useApplicationStore(state => state.fetchApplications);
    const fetchedOnce = useRef(false);

    useEffect(() => {
        if (fetchedOnce.current) return;

        if (leadIds.length === 0) {
            fetchLeads();
        } else {
            fetchApplications(leadIds);
            fetchedOnce.current = true; // ensure no second call
        }
    }, [leadIds]);


    const totalApplications = applications.length;

    const byStage = useMemo(() => {
        const map = new Map<string, number>();
        applications.forEach((app) => {
            const key = app.application_stage || "Unknown";
            map.set(key, (map.get(key) || 0) + 1);
        });
        return Array.from(map, ([name, value]) => ({ name, value }));
    }, [applications]);

    const preferredCountry = useMemo(() => {
        const map = new Map<string, number>();
        applications.forEach((app) => {
            app.preferences?.forEach((p) => {
                const c = p.preferred_country || "Unknown";
                map.set(c, (map.get(c) || 0) + 1);
            });
        });
        return Array.from(map, ([name, value]) => ({ name, value })).sort(
            (a, b) => b.value - a.value
        );
    }, [applications]);

    const preferredCourse = useMemo(() => {
        const map = new Map<string, number>();
        applications.forEach((app) => {
            app.preferences?.forEach((p) => {
                const c =
                    p.preferred_course_name || p.preferred_course_type || "Unknown";
                map.set(c, (map.get(c) || 0) + 1);
            });
        });
        return Array.from(map, ([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    }, [applications]);

    if (loading) {
        return (
            <div className="grid gap-4">
                <Skeleton className="h-10 w-40" />{" "}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="h-24 flex items-center shadow-md">
                    <CardBody>
                        <p className="text-sm text-default-500">Total Applications</p>
                        <p className="text-3xl mt-3 font-bold">{totalApplications}</p>
                    </CardBody>
                </Card>

                <Card className="h-24 flex items-center shadow-md">
                    <CardBody>
                        <p className="text-sm text-default-500">Unique Countries</p>
                        <p className="text-3xl mt-3 font-bold">{preferredCountry.length}</p>
                    </CardBody>
                </Card>

                <Card className="h-24 flex items-center shadow-md">
                    <CardBody>
                        <p className="text-sm text-default-500">
                            Current Application Stages
                        </p>
                        <p className="text-3xl mt-3 font-bold">{byStage.length}</p>
                    </CardBody>
                </Card>

                <Card className="h-24 flex items-center shadow-md">
                    <CardBody>
                        <p className="text-sm text-default-500">Top Courses</p>
                        <p className="text-3xl mt-3 font-bold">{preferredCourse.length}</p>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="h-72 shadow-md">
                    <CardHeader>Applications by Stage</CardHeader>
                    <CardBody>
                        {applications.length > 0 && (<ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={byStage}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={70}
                                    innerRadius={40}
                                    label
                                >
                                    {byStage.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                />
                            </PieChart>
                        </ResponsiveContainer>) || (<p className="text-center">No application data available.</p>)}
                    </CardBody>
                </Card>

                <Card className="h-72 shadow-md">
                    <CardHeader>Top Preferred Courses</CardHeader>
                    <CardBody>
                        {preferredCourse.length > 0 && (<ResponsiveContainer width="100%" height="100%">
                            <BarChart data={preferredCourse} layout="vertical">
                                <XAxis type="number" />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={120}
                                    fontSize={12}
                                />
                                <Tooltip />
                                <Bar dataKey="value">
                                    {preferredCourse.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>) || (<p className="text-center">No application data available.</p>)}
                    </CardBody>
                </Card>
            </div>

            <Card className="h-80 shadow-md">
                <CardHeader>Preferred Countries</CardHeader>
                <CardBody>
                    {preferredCountry.length > 0 && (<ResponsiveContainer width="100%" height="100%">
                        <BarChart data={preferredCountry}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value">
                                {preferredCountry.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>) || (<p className="text-center">No application data available.</p>)}
                </CardBody>
            </Card>
        </div>
    );
}
