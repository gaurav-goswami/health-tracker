import { create } from "zustand";

interface HealthRecord {
    id: string;
    name: string;
    age: number;
    status: string;
    updated_at: string;
}

interface HealthStore {
    records: HealthRecord[];
    addRecord: (record: HealthRecord) => void;
    setRecords: (records: HealthRecord[]) => void;
    removeRecord: (id: string) => void;
    getRecords: () => HealthRecord[];
}

export const useHealthStore = create<HealthStore>((set, get) => ({
    records: [],
    addRecord: (record) =>
        set((state) => {
            if (!state.records.some((r) => r.id === record.id)) {
                return { records: [...state.records, record] };
            }
            return state;
        }),
    setRecords: (records) => set({ records }),
    removeRecord: (id) =>
        set((state) => ({
            records: state.records.filter((record) => record.id !== id),
        })),
    getRecords: () => get().records,
}));
