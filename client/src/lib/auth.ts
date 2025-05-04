/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { routes } from ".";
import { toast } from "sonner";

export const loginUser = async (data: { email: string, password: string }) => {
    try {
        const response = await axios.post(
            routes.auth_url,
            {
                email: data.email,
                password: data.password
            },
            {
                withCredentials: true
            }
        );
        return response.data;

    } catch (error: any) {
        console.log("Error", error);
        toast.error(error.response?.data?.errors[0].message || "Login failed. Please try again.");
    }
};