import django_filters

from .models import Patient, Medication, Prescription


# OopCompanion:suppressRename


class PatientFilter(django_filters.FilterSet):
    nom = django_filters.CharFilter(field_name="last_name", lookup_expr="icontains")
    prenom = django_filters.CharFilter(field_name="first_name", lookup_expr="icontains")
    date_naissance = django_filters.DateFilter(field_name="birth_date")
    id = django_filters.CharFilter(method="filter_ids")

    def filter_ids(self, queryset, name, value):
        request = getattr(self, "request", None)
        values = []
        if request is not None:
            repeated = request.GET.getlist("id")
            for v in repeated:
                values.extend(v.split(","))
        if not values and value:
            values = value.split(",")
        ids = [int(v) for v in values if str(v).strip().isdigit()]
        return queryset.filter(id__in=ids) if ids else queryset

    class Meta:
        model = Patient
        fields = []


class MedicationFilter(django_filters.FilterSet):
    code = django_filters.CharFilter(field_name="code", lookup_expr="icontains")
    label = django_filters.CharFilter(field_name="label", lookup_expr="icontains")
    status = django_filters.CharFilter(field_name="status", lookup_expr="exact")

    class Meta:
        model = Medication
        fields = ["code", "label", "status"]


class PrescriptionFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status", lookup_expr="exact")
    patient = django_filters.NumberFilter(field_name="patient_id", lookup_expr="exact")
    medication = django_filters.NumberFilter(field_name="medication_id", lookup_expr="exact")

    start_date = django_filters.DateFilter(field_name="start_date")
    end_date = django_filters.DateFilter(field_name="end_date")

    start_date__gte = django_filters.DateFilter(field_name="start_date", lookup_expr="gte")
    start_date__lte = django_filters.DateFilter(field_name="start_date", lookup_expr="lte")

    end_date__gte = django_filters.DateFilter(field_name="end_date", lookup_expr="gte")
    end_date__lte = django_filters.DateFilter(field_name="end_date", lookup_expr="lte")

    class Meta:
        model = Prescription
        fields = ["patient", "medication",
                  "start_date", "start_date__gte", "start_date__lte",
                  "end_date", "end_date__gte", "end_date__lte", "status"]
