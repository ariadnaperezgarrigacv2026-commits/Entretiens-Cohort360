from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets

from .models import Patient, Medication, Prescription
from .filters import PatientFilter, MedicationFilter, PrescriptionFilter
from .serializers import PatientSerializer, MedicationSerializer, PrescriptionSerializer


# OopCompanion:suppressRename


class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture seule des patients avec filtrage via query params."""

    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = PatientFilter


class MedicationViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture seule des médicaments avec filtrage via query params."""

    serializer_class = MedicationSerializer
    queryset = Medication.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = MedicationFilter


class PrescriptionViewSet(viewsets.ModelViewSet):
    """Permettre de créer, consulter et mettre à jour des prescriptions."""

    serializer_class = PrescriptionSerializer
    queryset = Prescription.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = PrescriptionFilter

