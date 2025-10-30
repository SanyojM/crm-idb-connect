"use client";

import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
} from "@heroui/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Lead } from "@/stores/useLeadStore";
import { useAuthStore } from "@/stores/useAuthStore";
import LeadActionsMenu from "./tableActionCell";
import { ArrowRight, FilterIcon, FlagIcon } from "lucide-react";

import { filterLeads } from "@/lib/filterLeads";
import { LeadFilterOptions, LeadFilterState } from "@/types/filters";
import LeadFiltersDrawer from "@/components/leads-components/LeadFilters";
import LeadsTableToolbar from "./leadsTableToolbar";

const columns = [
  { uid: "select", name: "" },
  { uid: "date", name: "Date" },
  { uid: "name", name: "Name/Phone" },
  { uid: "owner", name: "Lead Owner" },
  { uid: "type", name: "Lead Type" },
  { uid: "source", name: "Lead Source" },
  { uid: "country", name: "Preferred Country" },
  { uid: "status", name: "Lead Status" },
  { uid: "actions", name: "Action" },
];

const statusColorMap: { [key: string]: "primary" | "secondary" | "success" | "warning" | "danger" | "default" } = {
  new: "primary",
  interested: "secondary",
  inprocess: "warning",
  hot: "warning",
  engaged: "warning",
  contacted: "secondary",
  assigned: "success",
  cold: "default",
  rejected: "danger",
};

interface LeadsTableProps {
  leads: Lead[];
  selectedLeadIds: string[];
  setSelectedLeadIds: Dispatch<SetStateAction<string[]>>;
}

export default function LeadsTable({ leads, selectedLeadIds, setSelectedLeadIds }: LeadsTableProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  // ---------- Build options from current dataset (could be fetched server-side if preferred)
  const options: LeadFilterOptions = useMemo(() => {
    const uniq = <T extends string | null | undefined>(arr: T[]) =>
      Array.from(new Set(arr.filter(Boolean))) as string[];

    return {
      types: uniq(leads.map((l) => l.purpose ?? "")),
      owners: uniq(leads.map((l) => l.assigned_partner?.name ?? "Unassigned")),
      statuses: uniq(leads.map((l) => (l.status ?? "").toLowerCase())).map(
        (s) => (s.charAt(0).toUpperCase() + s.slice(1)) || ""
      ),
      sources: uniq(leads.map((l) => l.utm_source ?? "")),
      countries: uniq(leads.map((l) => l.preferred_country ?? "")),
    };
  }, [leads]);

  // ---------- Filter state
  const [filters, setFilters] = useState<LeadFilterState>({
    search: "",
    types: [],
    owners: [],
    statuses: [],
    sources: [],
    countries: [],
    dateRange: undefined,
  });

  // ---------- Apply filters
  const filteredLeads = useMemo(() => filterLeads(leads, filters), [leads, filters]);
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  // ---------- Selection logic (unchanged)
  const handleSelectionChange = (keys: "all" | Set<React.Key>) => {
    const currentLeadIdsOnTab = new Set(filteredLeads.map((lead) => lead.id));
    const selectionsFromOtherTabs = selectedLeadIds.filter((id) => !currentLeadIdsOnTab.has(id));

    let currentTabSelections: string[] = [];
    if (keys === "all") {
      currentTabSelections = filteredLeads
        .map((lead) => lead.id)
        .filter((id): id is string => typeof id === "string");
    } else {
      currentTabSelections = Array.from(keys).map(String);
    }

    const newTotalSelection = [...new Set([...selectionsFromOtherTabs, ...currentTabSelections])];
    setSelectedLeadIds(newTotalSelection);
  };

  const renderCell = React.useCallback(
    (lead: Lead, columnKey: React.Key) => {
      switch (columnKey) {
        case "date":
          return (
            <div className="text-xs text-gray-500">
              {lead.created_at ? format(new Date(lead.created_at), "dd MMM yyyy, HH:mm") : "-"}
            </div>
          );
        case "name":
          return (
            <div>
              <div className="font-medium">{lead.name}</div>
              <div className="text-xs text-gray-500">{lead.mobile}</div>
            </div>
          );
        case "owner":
          return lead.assigned_partner?.name || "Unassigned";
        case "type":
          return (
            <Chip radius="sm" size="sm" variant="flat" className="capitalize">
              {lead?.purpose ?? "-"}
            </Chip>
          );
        case "source":
          return (
            <span className="capitalize">
              {lead?.utm_source || "-"} / {lead?.utm_medium || "-"}
            </span>
          );
        case "country":
          return lead.preferred_country ?? "-";
        case "status":
          return (
            <Chip
              color={statusColorMap[lead.status?.toLowerCase()] || "default"}
              radius="sm"
              size="sm"
              variant="flat"
              className="capitalize"
            >
              {lead.status}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-end gap-1">
              <Tooltip content="Flag">
                <span className="cursor-pointer text-lg text-gray-500 active:opacity-50">
                  <FlagIcon className="h-4 w-4" />
                </span>
              </Tooltip>
              <Tooltip content="Actions">
                <span className="cursor-pointer text-lg text-gray-500 active:opacity-50">
                  <LeadActionsMenu leadId={lead.id as string} />
                </span>
              </Tooltip>
              <Tooltip content="Go to Lead">
                <span
                  className="cursor-pointer text-lg text-gray-500 active:opacity-50"
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return lead[columnKey as keyof Lead] as string;
      }
    },
    [router]
  );

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.dateRange?.start || filters.dateRange?.end ? 1 : 0) +
    filters.types.length +
    filters.owners.length +
    filters.statuses.length +
    filters.sources.length +
    filters.countries.length;

  return (
    <div className="flex flex-col gap-3">
      {/* Filter Bar */}
      <LeadsTableToolbar
        allLeads={leads}
        selectedLeadIds={selectedLeadIds}
        onOpenFilters={() => setFiltersOpen(true)}         // NEW: opens the drawer
        filtersActiveCount={activeCount}                   // NEW: show active count on button
      />

      {/* Drawer with filters (unchanged) */}
      <LeadFiltersDrawer
        value={filters}
        onChange={setFilters}
        options={options}
        isOpen={isFiltersOpen}
        onOpenChange={setFiltersOpen}
      />


      {/* Table */}
      <div className="max-h-[77vh] overflow-y-auto border rounded-lg">
        <Table
          aria-label="Table of leads"
          selectionMode="multiple"
          selectedKeys={new Set(selectedLeadIds)}
          onSelectionChange={(keys) => handleSelectionChange(keys as "all" | Set<React.Key>)}
        >
          <TableHeader columns={columns.filter((col) => user?.role === "admin" || col.uid !== "actions")}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "end" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={filteredLeads} emptyContent={"No leads found."}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
