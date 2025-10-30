import { CounsellorSidebar } from '@/components/counsellor-sidebar'
import React from 'react'

export default function CounsellorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full">
            <CounsellorSidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                {children}
            </main>
        </div>
    )
}
