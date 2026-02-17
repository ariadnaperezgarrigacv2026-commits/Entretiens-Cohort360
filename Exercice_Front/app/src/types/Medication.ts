export interface Medication {
    id: number;
    code: string;
    label: string;
    status: "actif" | "suppr";
}

