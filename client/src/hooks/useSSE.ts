/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HealthCardProps } from "@/components/health-card";
import { useHealthStore } from "@/lib/store";
import { useEffect } from "react";

type SSEMessage = {
    type: "CREATED" | "UPDATED";
    record: HealthCardProps;
    createdBy: { email: string };
};

export const useHealthSSE = () => {
    const { records, setRecords } = useHealthStore();

    useEffect(() => {
        const eventSource = new EventSource(
            `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080"}/api/v1/sse/health-updates`
        );

        eventSource.onmessage = (event) => {
            try {
                const message: SSEMessage = JSON.parse(event.data);
                const updatedRecord = message.record;

                const updatedList = (() => {
                    const exists = records.find((r) => r.id === updatedRecord.id);
                    if (exists) {
                        return records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r));
                    } else {
                        return [...records, updatedRecord];
                    }
                })();

                // @ts-ignore
                setRecords(updatedList);
            } catch (err) {
                console.error("Failed to parse SSE data:", err);
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE connection error:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [records, setRecords]);
};


