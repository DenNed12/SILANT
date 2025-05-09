from rest_framework import serializers
from .models import Machine, Maintenance, Complaint, Reference


class DynamicFieldsSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class MachineSerializer(DynamicFieldsSerializer):
    class Meta:
        model = Machine
        fields = '__all__'

    def to_representation(self, instance):
        request = self.context.get('request')
        fields = instance.get_visible_fields(request.user) if request else []
        return super().to_representation(instance)


class MaintenanceSerializer(DynamicFieldsSerializer):
    class Meta:
        model = Maintenance
        fields = '__all__'


class ComplaintSerializer(DynamicFieldsSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'


class ReferenceSerializer(DynamicFieldsSerializer):
    class Meta:
        model = Reference
        fields = '__all__'