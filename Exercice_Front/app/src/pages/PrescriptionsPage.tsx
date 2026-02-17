import {useCallback, useEffect, useState} from "react";
import type {Prescription} from "../types/Prescription";
import type {Patient} from "../types/Patient";
import type {Medication} from "../types/Medication";
import type {PrescriptionFiltersType} from "../types/PrescriptionFilters.ts";
import PrescriptionTable from "../components/PrescriptionTable";

import {deletePrescription, getPrescriptions} from "../api/prescriptions";
import {getPatients} from "../api/patients";
import {getMedications} from "../api/medications";
import PrescriptionFilters from "../components/PrescriptionFilters.tsx";

interface Props {
    onEdit: (prescription: Prescription) => void;
}


export default function PrescriptionsPage({onEdit}: Props) {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterPatient, setFilterPatient] = useState<string | "">("");
    const [filterMedication, setFilterMedication] = useState<string | "">("");
    const [filterStatus, setFilterStatus] = useState<string | "">("");

    const [filterStartFrom, setFilterStartFrom] = useState<string | "">("");
    const [filterStartTo, setFilterStartTo] = useState<string | "">("");

    const [filterEndFrom, setFilterEndFrom] = useState<string | "">("");
    const [filterEndTo, setFilterEndTo] = useState<string | "">("");

    // Load prescriptions with filters
    const loadPrescriptions = useCallback(async () => {
        setLoading(true);
        try {
            const filters: PrescriptionFiltersType = {};
            if (filterPatient) filters.patient = filterPatient;
            if (filterMedication) filters.medication = filterMedication;
            if (filterStatus) filters.status = filterStatus;
            if (filterStartFrom) filters.start_date__gte = filterStartFrom;
            if (filterStartTo) filters.start_date__lte = filterStartTo;
            if (filterEndFrom) filters.end_date__gte = filterEndFrom;
            if (filterEndTo) filters.end_date__lte = filterEndTo;

            const presData = await getPrescriptions(filters);
            setPrescriptions(presData);
        } catch (error) {
            console.error("Error fetching prescriptions", error);
        } finally {
            setLoading(false);
        }
    }, [
        filterPatient,
        filterMedication,
        filterStatus,
        filterStartFrom,
        filterStartTo,
        filterEndFrom,
        filterEndTo,
    ]);


    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [patData, medData] = await Promise.all([getPatients(), getMedications()]);
                setPatients(patData);
                setMedications(medData);

                await loadPrescriptions(); // load prescriptions after patients/medications
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [loadPrescriptions]);



    const handleDeletePrescription = async (prescription: Prescription) => {
        try {
            await deletePrescription(prescription.id); // call your API
            // Remove from state to update table
            setPrescriptions((prev) =>
                prev.filter((p) => p.id !== prescription.id)
            );
        } catch (error) {
            console.error("Error deleting prescription:", error);
            alert("Failed to delete prescription. Try again.");
        }
    };


    if (loading) return (
        <button
            className="inline-flex h-12 items-center rounded-lg bg-blue-500 px-6 text-neutral-50 disabled:pointer-events-none disabled:opacity-50 "
            disabled>
            <div
                className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
            <span className="ml-2">Loading... </span></button>
    );

    return (
        <div className="p-2">
            <h2 className="text-2xl font-bold mb-4 p-2">Liste des prescriptions existantes</h2>
            <PrescriptionFilters
                patients={patients}
                medications={medications}
                filterPatient={filterPatient}
                setFilterPatient={setFilterPatient}
                filterMedication={filterMedication}
                setFilterMedication={setFilterMedication}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterStartFrom={filterStartFrom}
                setFilterStartFrom={setFilterStartFrom}
                filterStartTo={filterStartTo}
                setFilterStartTo={setFilterStartTo}
                filterEndFrom={filterEndFrom}
                setFilterEndFrom={setFilterEndFrom}
                filterEndTo={filterEndTo}
                setFilterEndTo={setFilterEndTo}
                onApplyFilters={loadPrescriptions}
            />
            <PrescriptionTable
                prescriptions={prescriptions}
                patients={patients}
                medications={medications}
                onEdit={onEdit}
                onDelete={handleDeletePrescription}
            />
        </div>
    );
}


