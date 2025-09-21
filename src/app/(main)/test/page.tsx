// components/AgentTest.tsx
"use client";

import { useState, useEffect } from "react";
import { useAgentStore, Agent } from "@/stores/useAgentStore";

export default function AgentTest() {
  const { agents, fetchAgents, addAgent, updateAgent, deleteAgent } = useAgentStore();
  const [newAgent, setNewAgent] = useState<Omit<Agent, "id" | "created_at">>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    agency_name: "",
    address: "",
    city: "",
    state: "",
    area: "",
    zone: "",
    association_type: "",
    association_date: "",
    agreement_start_date: "",
    agreement_end_date: "",
    remarks: "",
  });

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleAddAgent = async () => {
    await addAgent(newAgent);
    setNewAgent({
      name: "",
      email: "",
      mobile: "",
      password: "",
      agency_name: "",
      address: "",
      city: "",
      state: "",
      area: "",
      zone: "",
      association_type: "",
      association_date: "",
      agreement_start_date: "",
      agreement_end_date: "",
      remarks: "",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Agent Store Tester</h2>

      {/* Form to add a new agent */}
      <div className="p-4 border rounded-lg shadow space-y-3">
        <h3 className="font-semibold">Add New Agent</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(newAgent).map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={(newAgent as any)[field] || ""}
              onChange={(e) =>
                setNewAgent((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="border rounded p-2"
            />
          ))}
        </div>
        <button
          onClick={handleAddAgent}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Agent
        </button>
      </div>

      {/* List of agents */}
      <div className="space-y-4">
        <h3 className="font-semibold">Agents List</h3>
        {agents.length === 0 ? (
          <p className="text-gray-500">No agents found.</p>
        ) : (
          <ul className="space-y-3">
            {agents.map((agent) => (
              <li
                key={agent.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <p className="font-bold">{agent.name}</p>
                  <p className="text-sm text-gray-600">{agent.email} | {agent.mobile}</p>
                  <p className="text-sm text-gray-500">{agent.agency_name} - {agent.city}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateAgent(agent.id!, { remarks: "Updated via UI" })}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteAgent(agent.id!)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
