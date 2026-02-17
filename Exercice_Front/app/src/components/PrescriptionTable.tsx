import type {Prescription} from "../types/Prescription";
import type {Patient} from "../types/Patient";
import type {Medication} from "../types/Medication";
import UpdateButton from "./UpdateButton.tsx";

interface Props {
    prescriptions: Prescription[];
    patients: Patient[];
    medications: Medication[];
    onEdit: (prescription: Prescription) => void;
    onDelete: (prescription: Prescription) => void;

}

export default function PrescriptionTable({
                                              prescriptions,
                                              patients,
                                              medications,
                                              onEdit,
                                              onDelete,
                                          }: Props) {
    const getPatientName = (patientId: number) => {
        const patient = patients.find(p => p.id === patientId);
        return patient
            ? `${patient.last_name} ${patient.first_name}`
            : "Unknown";
    };

    const getMedicationLabel = (medicationId: number) => {
        const medication = medications.find(m => m.id === medicationId);
        return medication
            ? `${medication.code} - ${medication.label}`
            : "Unknown";
    };

    return (
        <div className="bg-white shadow rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-200">
                <tr>
                    <th className="px-6 py-3 text-left">Patient</th>
                    <th className="px-6 py-3 text-left">Médicament</th>
                    <th className="px-6 py-3 text-left">Date de début</th>
                    <th className="px-6 py-3 text-left">Date de fin</th>
                    <th className="px-6 py-3 text-left">Statut</th>
                    <th className="px-6 py-3 text-left">Commentaire</th>
                    <th className="px-6 py-3 text-left">Modifier</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                {prescriptions.map((p) => (
                    <tr className="even:bg-gray-100 odd:bg-white"
                        key={p.id}>
                        <td className="px-6 py-4">
                            {getPatientName(p.patient)}
                        </td>

                        <td className="px-6 py-4">
                            {getMedicationLabel(p.medication)}
                        </td>

                        <td className="px-6 py-4">{p.start_date}</td>
                        <td className="px-6 py-4">{p.end_date}</td>

                        <td className="px-6 py-4 capitalize">
                            {p.status}
                        </td>

                        <td className="px-6 py-4">
                            {p.comment || "-"}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                            <UpdateButton name="Mise à jour" onClick={() => onEdit(p)}></UpdateButton>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        `Êtes-vous sûr·e de vouloir supprimer la prescription pour ${getPatientName(p.patient)}?`
                                    );
                                    if (confirmed) {
                                        onDelete(p);
                                    }
                                }}
                            >
                                Supprimer
                            </button>
                        </td>


                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}


