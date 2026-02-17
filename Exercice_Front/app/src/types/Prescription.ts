export interface Prescription {
    id: number;
    patient: number;       // ID only
    medication: number;    // ID only
    start_date: string;
    end_date: string;
    status: "valide" | "en_attente" | "suppr";
    comment?: string;
}

