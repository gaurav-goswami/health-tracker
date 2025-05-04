"use client";

import { useEffect, useState } from "react";
import HealthCard, { HealthCardProps } from "./health-card";
import { getAllHealthRecords } from "@/lib/health";
import { Loader2 } from "lucide-react";

const Health = () => {
    const [health, setHealth] = useState<HealthCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const records = await getAllHealthRecords();
                if (records) setHealth(records);
            } catch (err) {
                console.error("Failed to fetch records:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <div className="flex w-full h-screen items-center justify-center">
                    <Loader2 className="animate-spin" />
                </div>
            ) : health.length > 0 ? (
                <div className="flex gap-3 justify-start flex-wrap">
                    {
                        health.map((rec: HealthCardProps) => (
                            <HealthCard name={rec.name} status={rec.status} key={rec.id} id={rec.id} age={rec.age} />
                        ))
                    }
                </div>
            ) : (
                <span>No health records</span>
            )}
        </div>
    );
};

export default Health;
