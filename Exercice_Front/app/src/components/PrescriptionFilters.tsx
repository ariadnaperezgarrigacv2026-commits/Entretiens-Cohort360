import type {Patient} from "../types/Patient";
import type {Medication} from "../types/Medication";

interface Props {
    patients: Patient[];
    medications: Medication[];
    filterPatient: string | "";
    setFilterPatient: (id: string | "") => void;
    filterMedication: string | "";
    setFilterMedication: (id: string | "") => void;
    filterStatus: string | "";
    setFilterStatus: (status: string | "") => void;
    filterStartFrom: string | "";
    setFilterStartFrom: (date: string | "") => void;
    filterStartTo: string | "";
    setFilterStartTo: (date: string | "") => void;
    filterEndFrom: string | "";
    setFilterEndFrom: (date: string | "") => void;
    filterEndTo: string | "";
    setFilterEndTo: (date: string | "") => void;
    onApplyFilters: () => void;
}

export default function PrescriptionFilters({
                                                patients,
                                                medications,
                                                filterPatient,
                                                setFilterPatient,
                                                filterMedication,
                                                setFilterMedication,
                                                filterStatus,
                                                setFilterStatus,
                                                filterStartFrom,
                                                setFilterStartFrom,
                                                filterStartTo,
                                                setFilterStartTo,
                                                filterEndFrom,
                                                setFilterEndFrom,
                                                filterEndTo,
                                                setFilterEndTo,
                                                onApplyFilters,
                                            }: Props) {
    return (
        <div className="flex flex-wrap gap-4 mb-4 items-end min-w-full">
            {/* Patient Filter */}
            <div>
                <label className="block text-sm font-medium mb-1">Patient</label>
                <select
                    value={filterPatient}
                    onChange={(e) => setFilterPatient(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Tous les patients</option>
                    {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.last_name} {p.first_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Medication Filter */}
            <div>
                <label className="block text-sm font-medium mb-1">Médicament</label>
                <select
                    value={filterMedication}
                    onChange={(e) => setFilterMedication(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Tous les médicaments</option>
                    {medications.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.code} - {m.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Status Filter */}
            <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Tous les statuts</option>
                    <option value="valide">Valide</option>
                    <option value="en_attente">En attente</option>
                    <option value="suppr">Supprimé</option>
                </select>
            </div>

            {/* Start Date Range */}
            <div>
                <label className="block text-sm font-medium mb-1">Date de début (intervalle)</label>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={filterStartFrom}
                        onChange={(e) => setFilterStartFrom(e.target.value)}
                        className="border rounded px-3 py-2"
                        placeholder="From"
                    />
                    <input
                        type="date"
                        value={filterStartTo}
                        onChange={(e) => setFilterStartTo(e.target.value)}
                        className="border rounded px-3 py-2"
                        placeholder="To"
                    />
                </div>
            </div>

            {/* End Date Range */}
            <div>
                <label className="block text-sm font-medium mb-1">Date de fin (intervalle)</label>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={filterEndFrom}
                        onChange={(e) => setFilterEndFrom(e.target.value)}
                        className="border rounded px-3 py-2"
                        placeholder="From"
                    />
                    <input
                        type="date"
                        value={filterEndTo}
                        onChange={(e) => setFilterEndTo(e.target.value)}
                        className="border rounded px-3 py-2"
                        placeholder="To"
                    />
                </div>
            </div>

            {/* Apply Button */}
            <div>
                <button
                    onClick={onApplyFilters}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Filtrée
                </button>
            </div>

            <div>
                <button
                    type="button"
                    onClick={() => {
                        setFilterPatient("");
                        setFilterMedication("");
                        setFilterStatus("");
                        setFilterStartFrom("");
                        setFilterStartTo("");
                        setFilterEndFrom("");
                        setFilterEndTo("");
                        onApplyFilters(); // reload all prescriptions
                    }}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                    Réinitialiser les filtres
                </button>
            </div>

        </div>
    );
}

