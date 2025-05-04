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
        console.log("response.data", response.data);
        // setting the userId and email inside the localStorage for socket.io
        // A better approach can be used here instead of just saving the id and email inside localStorage
        localStorage.setItem("user-data", JSON.stringify({ id: response.data.user.id, email: response.data.user.email }));
        return response.data;

    } catch (error: any) {
        console.log("Error", error);
        toast.error(error.response?.data?.errors[0].message || "Login failed. Please try again.");
    }
};