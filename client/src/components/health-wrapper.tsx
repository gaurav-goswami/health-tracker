// components/HealthWrapper.tsx
"use client";

import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { toast } from "sonner";
import PatientDialogForm from "./create-health-record";
import Health from "./health";

const HealthWrapper = () => {
    const socketRef = useRef<Socket | null>(null);
    const userId = useRef<string | null>(null);

    useEffect(() => {
        const rawUser = localStorage.getItem("user-data");
        if (rawUser) {
            try {
                const parsed = JSON.parse(rawUser);
                userId.current = parsed.id;
            } catch (err) {
                console.error("Failed to parse user data from localStorage:", err);
            }
        }

        socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
            withCredentials: true,
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);

            if (userId.current) {
                socket.emit("register", userId.current);
            } else {
                console.warn("No user ID found in localStorage.");
            }
        });

        socket.on("record:information", (message) => {
            const type = message.type === "CREATED" ? true : message.type === "UPDATED" ? false : null;
            const createdBy = message.createdBy.email;

            toast(type ? "New record" : "Record updated", {
                description: `${type ? `A new record has been created by ${createdBy}` : `An existing record has been updated by ${createdBy}`}`,
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="flex flex-col gap-4 max-w-[1300px] mx-auto p-6">
            <PatientDialogForm />
            <Health />
        </div>
    );
};

export default HealthWrapper;
