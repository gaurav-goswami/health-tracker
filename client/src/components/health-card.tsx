"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteHealthRecord } from "@/lib/health";
import { toast } from "sonner";
import PatientDialogForm from "./create-health-record";

type Status = "HEALTHY" | "SICK" | "CRITICAL";

export interface HealthCardProps {
    name: string;
    status: Status;
    id: string;
    age: number;
}

const HealthCard = ({ name, status, id, age }: HealthCardProps) => {
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
        } catch (error) {
            console.error("Delete error:", error);
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
                <p className="text-gray-500">Patient Status Overview</p>
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
