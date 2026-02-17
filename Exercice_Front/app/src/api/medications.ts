import { api } from "./axios";
import type {Medication} from "../types/Medication";

export const getMedications = async (): Promise<Medication[]> => {
    const response = await api.get("/Medication");
    return response.data;
};
