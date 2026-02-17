from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from medical.models import Patient, Medication, Prescription


# OopCompanion:suppressRename


class ApiListTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Patients
        self.patient1 = Patient.objects.create(last_name="Martin", first_name="Jeanne", birth_date="1992-03-10")
        self.patient2 = Patient.objects.create(last_name="Durand", first_name="Jean", birth_date="1980-05-20")
        self.patient3 = Patient.objects.create(last_name="Bernard", first_name="Paul")

        # Medications
        self.med1 = Medication.objects.create(code="PARA500", label="Paracétamol 500mg", status=Medication.STATUS_ACTIF)
        self.med2 = Medication.objects.create(code="IBU200", label="Ibuprofène 200mg", status=Medication.STATUS_SUPPR)

        # Prescriptions
        self.prescription1 = Prescription.objects.create(
            patient=self.patient1,
            medication=self.med1,
            start_date="2026-02-01",
            end_date="2026-02-10",
            status=Prescription.STATUS_VALIDE,
            comment="à prendre après le repas"
        )

        self.prescription2 = Prescription.objects.create(
            patient=self.patient2,
            medication=self.med2,
            start_date="2026-01-15",
            end_date="2026-01-20",
            status=Prescription.STATUS_EN_ATTENTE,
            comment=""
        )

    def test_patient_list(self):
        url = reverse("patient-list")
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        self.assertGreaterEqual(len(r.json()), 3)

    def test_patient_filter_nom(self):
        url = reverse("patient-list")
        r = self.client.get(url, {"nom": "mart"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertTrue(all("mart" in p["last_name"].lower() for p in data))

    def test_patient_filter_date(self):
        url = reverse("patient-list")
        r = self.client.get(url, {"date_naissance": "1980-05-20"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertTrue(all(p["birth_date"] == "1980-05-20" for p in data))

    def test_medication_list(self):
        url = reverse("medication-list")
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        self.assertGreaterEqual(len(r.json()), 2)

    def test_medication_filter_status(self):
        url = reverse("medication-list")
        r = self.client.get(url, {"status": "actif"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertTrue(all(m["status"] == "actif" for m in data))

    def test_prescription_list(self):
        url = reverse("prescription-list")
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        self.assertGreaterEqual(len(r.json()), 2)

    def test_prescription_retrieve(self):
        url = reverse("prescription-detail", args=[self.prescription1.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["id"], self.prescription1.id)

    def test_create_prescription(self):
        url = reverse("prescription-list")
        data = {
            "patient": self.patient1.id,
            "medication": self.med2.id,
            "start_date": "2026-03-01",
            "end_date": "2026-03-05",
            "status": Prescription.STATUS_VALIDE,
            "comment": "New prescription"
        }
        r = self.client.post(url, data, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(Prescription.objects.count(), 3)

    def test_create_prescription_without_comment(self):
        url = reverse("prescription-list")
        data = {
            "patient": self.patient2.id,
            "medication": self.med1.id,
            "start_date": "2026-02-01",
            "end_date": "2026-02-05",
            "status": Prescription.STATUS_VALIDE,
        }
        r = self.client.post(url, data, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(Prescription.objects.count(), 3)
        self.assertEqual(Prescription.objects.order_by("id").last().comment, "")

    def test_update_prescription_put(self):
        url = reverse("prescription-detail", args=[self.prescription1.id])
        data = {
            "patient": self.patient1.id,
            "medication": self.med2.id,
            "start_date": "2026-02-01",
            "end_date": "2026-02-15",
            "status": Prescription.STATUS_SUPPR,
            "comment": "Updated comment"
        }
        r = self.client.put(url, data, format="json")
        self.assertEqual(r.status_code, 200)
        self.prescription1.refresh_from_db()
        self.assertEqual(self.prescription1.status, Prescription.STATUS_SUPPR)
        self.assertEqual(self.prescription1.comment, "Updated comment")

    def test_update_prescription_patch(self):
        url = reverse("prescription-detail", args=[self.prescription2.id])
        r = self.client.patch(url, {"status": Prescription.STATUS_VALIDE}, format="json")
        self.assertEqual(r.status_code, 200)
        self.prescription2.refresh_from_db()
        self.assertEqual(self.prescription2.status, Prescription.STATUS_VALIDE)

    def test_prescription_filter_by_patient(self):
        url = reverse("prescription-list")
        r = self.client.get(url, {"patient": self.patient1.id})
        self.assertTrue(all(p["patient"] == self.patient1.id for p in r.json()))

    def test_prescription_filter_by_medication(self):
        url = reverse("prescription-list")
        r = self.client.get(url, {"medication": self.med2.id})
        self.assertTrue(all(p["medication"] == self.med2.id for p in r.json()))

    def test_prescription_filter_by_status(self):
        url = reverse("prescription-list")
        r = self.client.get(url, {"status": Prescription.STATUS_VALIDE})
        self.assertTrue(all(p["status"] == Prescription.STATUS_VALIDE for p in r.json()))

    def test_prescription_filter_by_start_date_range(self):
        url = reverse("prescription-list")
        r = self.client.get(url, {"start_date__gte": "2026-02-01", "start_date__lte": "2026-02-28"})
        self.assertTrue(all("2026-02" in p["start_date"] for p in r.json()))
