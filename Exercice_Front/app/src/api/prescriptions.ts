import { api } from "./axios";
import type {Prescription} from "../types/Prescription";


interface FilterParams {
    patient?: string;
    medication?: string;
    status?: string;
    start_date?: string;
    start_date__gte?: string;
    start_date__lte?: string;
    end_date?: string;
    end_date__gte?: string;
    end_date__lte?: string;
}

export const getPrescriptions = async (filters?: FilterParams): Promise<Prescription[]> => {
    const response = await api.get("/Prescription", { params: filters });
    return response.data;
};

export const createPrescription = async (data: {
    patient: string;
    medication: string;
    start_date: string;
    end_date: string;
    status: string;
    comment?: string;
}) => {
    const response = await api.post("/Prescription", data);
    return response.data;
};

export const updatePrescription = async (
    id: number,
    data: {
        patient: string;
        medication: string;
        start_date: string;
        end_date: string;
        status: string;
        comment?: string;
    }
) => {
    const response = await api.put(`/Prescription/${id}`, data);
    return response.data;
};

export const deletePrescription = async (id: number) => {
    const response = await api.delete(`/Prescription/${id}`);
    return response.data;
};



