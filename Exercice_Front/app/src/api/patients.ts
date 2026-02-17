import { api } from "./axios";
import type {Patient} from "../types/Patient";

export const getPatients = async (): Promise<Patient[]> => {
    const response = await api.get("/Patient");
    return response.data;
};
