/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useEffect, useState } from "react";
import HealthCard, { HealthCardProps } from "./health-card";
import { getAllHealthRecords } from "@/lib/health";
import { Loader2 } from "lucide-react";
import { useHealthStore } from "@/lib/store"; // Import your store

const Health = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { records, setRecords } = useHealthStore();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedRecords = await getAllHealthRecords();
                if (fetchedRecords) {
                    setRecords(fetchedRecords);
                }
            } catch (err) {
                console.error("Failed to fetch records:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setRecords]);

    return (
        <div>
            {loading ? (
                <div className="flex w-full h-screen items-center justify-center">
                    <Loader2 className="animate-spin" />
                </div>
            ) : records.length > 0 ? (
                <div className="flex gap-3 justify-start flex-wrap">
                    {/* @ts-ignore */}
                    {records.map((rec: HealthCardProps) => (
                        <HealthCard
                            key={rec.id}
                            id={rec.id}
                            name={rec.name}
                            age={rec.age}
                            status={rec.status}
                        />
                    ))}
                </div>
            ) : (
                <span>No health records</span>
            )}
        </div>
    );
};

export default Health;
