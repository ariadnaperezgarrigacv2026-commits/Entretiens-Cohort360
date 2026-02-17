import { useEffect, useState } from "react";
import type {Patient} from "../types/Patient";
import type {Medication} from "../types/Medication";
import type {Prescription} from "../types/Prescription";
import { getPatients } from "../api/patients";
import { getMedications } from "../api/medications";
import { updatePrescription } from "../api/prescriptions";
import * as React from "react";

interface Props {
    prescription: Prescription;
    onSuccess: () => void; // callback after successful update
}

export default function EditPrescriptionForm({ prescription, onSuccess }: Props) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [medications, setMedications] = useState<Medication[]>([]);

    const [patientId, setPatientId] = useState(prescription.patient);
    const [medicationId, setMedicationId] = useState(prescription.medication);
    const [startDate, setStartDate] = useState(prescription.start_date);
    const [endDate, setEndDate] = useState(prescription.end_date);
    const [status, setStatus] = useState(prescription.status);
    const [comment, setComment] = useState(prescription.comment || "");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [patData, medData] = await Promise.all([
                    getPatients(),
                    getMedications(),
                ]);
                setPatients(patData);
                setMedications(medData);
            } catch (error) {
                console.error("Error loading patients or medications:", error);
            }
        };

        loadData();
    }, []);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (endDate < startDate) {
            alert("End date cannot be before start date.");
            return;
        }

        await updatePrescription(prescription.id, {
            patient: patientId.toString(),
            medication: medicationId.toString(),
            start_date: startDate,
            end_date: endDate,
            status,
            comment,
        });

        onSuccess();
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Modifier des informations des la prescription</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Patient */}
                <select
                    value={patientId}
                    onChange={(e) => setPatientId(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.last_name} {p.first_name}
                        </option>
                    ))}
                </select>

                {/* Medication */}
                <select
                    value={medicationId}
                    onChange={(e) => setMedicationId(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Select medication</option>
                    {medications
                        .filter((m) => m.status === "actif")
                        .map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.code} - {m.label}
                            </option>
                        ))}
                </select>

                {/* Start Date */}
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                {/* End Date */}
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "valide" | "en_attente" | "suppr")}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="valide">Valide</option>
                    <option value="en_attente">En attente</option>
                    <option value="suppr">Supprimé</option>
                </select>

                {/* Comment */}
                <input
                    type="text"
                    placeholder="Comment (optional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Mise à jour la prescription
                </button>
            </form>
        </div>
    );
}
