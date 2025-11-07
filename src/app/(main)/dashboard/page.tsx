"use client";

import DashboardApplications from "@/components/dashboard-components/dashboardApplications"
import DashboardLeads from "@/components/dashboard-components/dashboardLeads"
import DashboardPayments from "@/components/dashboard-components/dashboardPayments"
import { Tabs, Tab } from "@heroui/react"
export default function Page() {
    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Dashboard Sections" variant="bordered" color="secondary" className="w-full" >
                <Tab key="home" title="Home">
                    <DashboardLeads />
                </Tab>
                <Tab key="leads" title="Leads">
                    <DashboardLeads />
                </Tab>
                <Tab key="admissions" title="Applications">
                    <DashboardApplications />
                </Tab>
                <Tab key="payments" title="Payments">
                    <DashboardPayments />
                </Tab>
            </Tabs>
        </div>
    )
}