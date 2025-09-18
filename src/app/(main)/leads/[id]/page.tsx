"use client";

import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useLeadStore, Lead } from "@/stores/useLeadStore";
import StatusTimeline from "@/components/leads-components/leadStatusTimeline";

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex justify-between py-2 border-b border-dotted border-gray-200">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="text-gray-900 font-medium text-sm">
            {value || '-'}
        </span>
    </div>
);

export default function LeadDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { leads, fetchLeads, loading, updateLead } = useLeadStore();

    const lead = useMemo(() => leads.find((l) => l.id === id), [id, leads]);

    useEffect(() => {
        if (!loading && leads.length === 0) {
            fetchLeads();
        }
    }, [leads.length, fetchLeads, loading]);


    const handleStatusChange = async (newStatus: string) => {
        if (!lead || !lead.id) return;
        await updateLead(lead.id, { status: newStatus });
    };


    if (loading || !lead) {
        return <div className="p-8">Loading lead details...</div>;
    }

    return (
        <div className=" bg-gray-50">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex items-center gap-4">
                    <img
                        src="https://swiftwebapp.sgp1.digitaloceanspaces.com/images/avatar.png"
                        alt="profile"
                        className="w-16 h-16 rounded-full border"
                    />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{lead.name}</h1>
                        <p className="text-blue-600 text-sm">{lead.mobile}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button className="px-4 py-2 bg-pink-100 text-pink-600 rounded-lg font-medium">
                        Download Profile
                    </button>
                    <div className="text-sm">
                        <p className="text-gray-500">Branch</p>
                        <p className="text-blue-600 font-medium">
                            {lead.address || "N/A"}
                        </p>
                    </div>
                    <div className="text-sm">
                        <p className="text-gray-500">Lead Manager</p>
                        <p className="text-blue-600 font-medium">
                            {lead.assignedto || "Unassigned"}
                        </p>
                    </div>
                </div>
            </div>

            <StatusTimeline
                currentStatus={lead.status || "New"}
                onChange={handleStatusChange}
            />
            <div className="mt-6 border-b border-gray-200">
                <nav className="flex space-x-6 text-sm font-medium">
                    <a href="#" className="py-3 border-b-2 border-blue-500 text-blue-600">
                        Details
                    </a>
                    <a href="#" className="py-3 text-gray-500 hover:text-blue-600">
                        Notes
                    </a>
                    <a href="#" className="py-3 text-gray-500 hover:text-blue-600">
                        Follow Ups
                    </a>
                    <a href="#" className="py-3 text-gray-500 hover:text-blue-600">
                        Documents
                    </a>
                    <a href="#" className="py-3 text-gray-500 hover:text-blue-600">
                        Courses
                    </a>
                    <a href="#" className="py-3 text-gray-500 hover:text-blue-600">
                        Tasks
                    </a>
                </nav>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Personal & Lead Details
                    </h3>
                    <InfoRow label="Full Name" value={lead.name} />
                    <InfoRow label="Mobile" value={lead.mobile} />
                    <InfoRow label="Email" value={lead.email} />
                    <InfoRow label="Address" value={lead.address} />
                    <InfoRow label="Status" value={lead.status} />
                    <InfoRow label="Type" value={lead.type} />
                    <InfoRow label="Qualifications" value={lead.qualifications} />
                    <InfoRow
                        label="Preferred Country"
                        value={lead.preferredcountry}
                    />
                    <InfoRow
                        label="Exam Done"
                        value={lead.doneexam ? 'Yes' : 'No'}
                    />
                    {lead.doneexam && lead.examscores && Object.keys(lead.examscores).length > 0 ? (
                        Object.entries(lead.examscores).map(([exam, score]) => {  
                            if (!score) return null;

                            return (
                                <InfoRow
                                    key={exam}
                                    label={`Score (${exam.toUpperCase()})`} 
                                    value={String(score)}
                                />
                            );
                        })
                    ) : (
                        <InfoRow label="Exam Scores" value="Not Available" />
                    )}

                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Tracking Details
                    </h3>
                    <InfoRow label="UTM Source" value={lead.utmsource} />
                    <InfoRow label="UTM Medium" value={lead.utmmedium} />
                    <InfoRow label="UTM Campaign" value={lead.utmcampaign} />
                    <InfoRow label="Assigned To" value={lead.assignedto || '-'} />
                    <InfoRow
                        label="Created At"
                        value={lead.createdat ? format(new Date(lead.createdat), "dd MMM yyyy, hh:mm a") : '-'}
                    />
                    <InfoRow
                        label="Updated At"
                        value={lead.updatedat ? format(new Date(lead.updatedat), "dd MMM yyyy, hh:mm a") : '-'}
                    />
                </div>

            </div>
        </div>
    );
}
