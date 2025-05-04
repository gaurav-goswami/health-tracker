/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "sonner";
import { routes } from ".";
import { z } from "zod";
import { formSchema } from "@/resolvers/resolver";

export const createHealthRecord = async (data: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.post(routes.health_record,
            {
                name: data.name,
                age: data.age,
                status: data.status
            },
            {
                withCredentials: true
            }
        );
        console.log("response from create  health record", response.data);
        return response.data.record;
    } catch (error: any) {
        console.log("Error", error);
        toast.error(error.response?.data?.errors[0].message || "Login failed. Please try again.");
    }
}

export const getAllHealthRecords = async () => {
    try {
        const response = await axios.get(routes.health_record, { withCredentials: true });
        console.log("response", response.data);
        return response.data.records;
    } catch (error: any) {
        console.log("Error", error);
        toast.error(error.response?.data?.errors[0].message || "Login failed. Please try again.");
    }
};

export const deleteHealthRecord = async (id: string) => {
    try {
        const response = await axios.delete(`${routes.health_record}/${id}`, { withCredentials: true });
        console.log("response", response.data);
        return response.data;
    } catch (error: any) {
        console.log("Error", error);
        toast.error(error.response?.data?.errors[0].message || "Login failed. Please try again.");

    }
}

export const updateHealthRecord = async (id: string, data: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.put(`${routes.health_record}/${id}`, { name: data.name, age: data.age, status: data.status }, { withCredentials: true });
        console.log("response", response.data);
        return response.data;
    } catch (error: any) {
        console.log("Error", error);
        toast.error(error.response?.data?.errors[0].message || "Login failed. Please try again.");

    }
}