from rest_framework import serializers
from .models import Patient, Medication, Prescription


# OopCompanion:suppressRename


class PrescriptionSerializer(serializers.ModelSerializer):
    comment = serializers.CharField(required=False, allow_blank=True, default="")

    class Meta:
        model = Prescription
        fields = ["id", "patient", "medication", "start_date", "end_date", "status", "comment"]

    def validate(self, data):
        start = data.get("start_date", getattr(self.instance, "start_date", None))
        end = data.get("end_date", getattr(self.instance, "end_date", None))
        if start and end and end < start:
            raise serializers.ValidationError("End date cannot be before start date")
        return data

    def validate_patient(self, value):
        if not Patient.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Patient does not exist.")
        return value

    def validate_medication(self, value):
        if not Medication.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Medication does not exist.")
        return value


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["id", "last_name", "first_name", "birth_date"]
        prescriptions = PrescriptionSerializer(many=True, read_only=True)


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ["id", "code", "label", "status"]
