/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createHealthRecord, updateHealthRecord } from "@/lib/health";
import { formSchema } from "@/resolvers/resolver";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";

type FormSchema = z.infer<typeof formSchema>;

interface PatientDialogFormProps {
    triggerButton?: React.ReactNode;
    defaultValues?: Partial<FormSchema> & { id?: string };
    isEditMode?: boolean;
}

const PatientDialogForm = ({ triggerButton, defaultValues, isEditMode = false }: PatientDialogFormProps) => {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormSchema>({
        // @ts-ignore
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    useEffect(() => {
        if (open && defaultValues) {
            reset(defaultValues);
        }
    }, [open, defaultValues, reset]);

    const onSubmit = async (data: FormSchema) => {
        try {
            if (isEditMode && defaultValues?.id) {
                await updateHealthRecord(defaultValues.id, data);
                toast("Health record updated");
            } else {
                await createHealthRecord(data);
                toast("Health record created");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setOpen(false);
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton ? triggerButton : (
                    <Button className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 w-full">
                        <Plus className="w-4 h-4" />
                        Add Patient
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="rounded-xl">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Patient Info" : "Add Patient Info"}</DialogTitle>
                </DialogHeader>
                {/* @ts-ignore */}
                <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                        <input
                            type="text"
                            {...register("name")}
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                            type="text"
                            {...register("age")}
                            placeholder="30"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                        />
                        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            {...register("status")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white"
                        >
                            <option value="">Select status</option>
                            <option value="HEALTHY">HEALTHY</option>
                            <option value="SICK">SICK</option>
                            <option value="CRITICAL">CRITICAL</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                    >
                        {isEditMode ? "Update" : "Save"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PatientDialogForm;
