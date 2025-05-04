/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteHealthRecord, updateHealthRecord } from "@/lib/health";
import { toast } from "sonner";
import PatientDialogForm from "./create-health-record";
import { useHealthStore } from "@/lib/store"; // Assuming you have a health store for state management

type Status = "HEALTHY" | "SICK" | "CRITICAL";

export interface HealthCardProps {
    name: string;
    status: Status;
    id: string;
    age: number;
    updated_at?: string;
}

const HealthCard = ({ name, status, id, age, updated_at }: HealthCardProps) => {
    const { removeRecord } = useHealthStore();

    const getStatusStyle = (status: Status) => {
        switch (status) {
            case "HEALTHY":
                return "bg-green-100 text-green-800";
            case "SICK":
                return "bg-yellow-100 text-yellow-800";
            case "CRITICAL":
                return "bg-red-100 text-red-800";
            default:
                return "";
        }
    };

    const handleDelete = async () => {
        try {
            await deleteHealthRecord(id);
            toast("Record deleted successfully");
            removeRecord(id); 
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleUpdate = async (updatedRecord: HealthCardProps) => {
        try {
            await updateHealthRecord(id, updatedRecord);
            toast("Record updated successfully");
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    return (
        <div className="w-full max-w-sm bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusStyle(status)}`}>
                    {status}
                </span>
            </div>

            <div className="text-sm text-gray-600">
                <p><span className="font-medium">Age:</span> {age} years</p>
                <p><span className="font-medium">Last Updated:</span> {new Date(updated_at as string).toLocaleString()}</p>
            </div>

            <div className="flex gap-3 mt-2">
                <PatientDialogForm
                    isEditMode
                    defaultValues={{ name, status, age, id }}
                    triggerButton={
                        <button className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                            <Pencil size={16} />
                            Edit
                        </button>
                    }
                    // @ts-ignore
                    onSubmit={handleUpdate}
                />
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 text-red-600 hover:underline text-sm"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </div>
    );
};

export default HealthCard;
