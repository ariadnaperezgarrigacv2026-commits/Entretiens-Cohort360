import {useState} from "react";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import MenuButton from "./components/MenuButton.tsx";
import EditPrescriptionForm from "./components/EditPrescriptionForm.tsx";
import type {Prescription} from "./types/Prescription.ts";
import PrescriptionForm from "./components/PrescriptionForm.tsx";

export default function App() {
    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 text-white p-4 flex justify-between">
                <h1 className="font-bold text-4xl">Prescription App</h1>
                <div className="space-x-4">
                    <MenuButton name="Nouvelle prescription" onClick={() => setView("create")}/>
                    <MenuButton name="Liste des prescriptions" onClick={() => setView("list")}/>
                </div>
            </nav>

            <div className="p-6">
                {view === "list" && (
                    <PrescriptionsPage
                        onEdit={(p) => {
                            setEditingPrescription(p);
                            setView("edit");
                        }}
                    />
                )}
                {view === "create" && (
                    <PrescriptionForm
                        onSuccess={() => setView("list")}
                    />
                )}
                {view === "edit" && editingPrescription && (
                    <EditPrescriptionForm
                        prescription={editingPrescription}
                        onSuccess={() => setView("list")}
                    />
                )}
            </div>
        </div>
    );
}


