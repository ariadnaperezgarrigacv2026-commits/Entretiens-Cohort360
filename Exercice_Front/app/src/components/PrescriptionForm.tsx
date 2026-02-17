import { useEffect, useState } from "react";
import type {Patient} from "../types/Patient";
import type {Medication} from "../types/Medication";
import { createPrescription } from "../api/prescriptions";
import { getPatients } from "../api/patients";
import { getMedications } from "../api/medications";
import * as React from "react";

interface Props {
    onSuccess: () => void;
}


export default function PrescriptionForm({ onSuccess }: Props) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [medications, setMedications] = useState<Medication[]>([]);

    const [patientId, setPatientId] = useState("");
    const [medicationId, setMedicationId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("valide");
    const [comment, setComment] = useState("");


    useEffect(() => {
        const loadData = async () => {
            const [patData, medData] = await Promise.all([
                getPatients(),
                getMedications(),
            ]);

            setPatients(patData);
            setMedications(medData);
        };

        loadData();
    }, []);


    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (endDate < startDate) {
            alert("End date cannot be before start date.");
            return;
        }

        await createPrescription({
            patient: patientId,
            medication: medicationId,
            start_date: startDate,
            end_date: endDate,
            status,
            comment,
        });

        onSuccess();
    };


    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Créer une prescription</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Patient */}
                <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Patient (obligatoire)</option>
                    {patients.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.last_name} {p.first_name}
                        </option>
                    ))}
                </select>

                {/* Medication */}
                <select
                    value={medicationId}
                    onChange={(e) => setMedicationId(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Médicament (obligatoire)</option>
                    {medications
                        .filter(m => m.status === "actif")
                        .map(m => (
                            <option key={m.id} value={m.id}>
                                {m.code} - {m.label}
                            </option>
                        ))}
                </select>

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="valide">Valide</option>
                    <option value="en_attente">En attente</option>
                    <option value="suppr">Supprimé</option>
                </select>

                <input
                    type="text"
                    placeholder="Commentaire (facultatif)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Créer
                </button>
            </form>
        </div>
    );
}

