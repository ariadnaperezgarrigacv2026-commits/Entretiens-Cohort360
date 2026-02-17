export interface PrescriptionFiltersType {
    patient?: string | "";
    medication?: string | "";
    status?: string | "";
    start_date__gte?: string;
    start_date__lte?: string;
    end_date__gte?: string;
    end_date__lte?: string;
}
