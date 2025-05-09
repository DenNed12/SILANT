from django.contrib import admin
from django import forms
from .models import Machine, Maintenance, Complaint, Reference
from django.contrib.auth import get_user_model

User = get_user_model()


class BaseAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)  # Извлекаем request первым делом
        super().__init__(*args, **kwargs)


class MachineAdminForm(BaseAdminForm):
    class Meta:
        model = Machine
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # if self.request and not self.request.user.is_superuser:
        #     if self.request.user.role == 'CLIENT':
        #         self.fields['client'].queryset = User.objects.filter(pk=self.request.user.pk)
        #         self.fields['client'].initial = self.request.user
        #         self.fields['client'].disabled = True
        #     elif self.request.user.role == 'SERVICE':
        #         self.fields['service_company'].queryset = User.objects.filter(pk=self.request.user.pk)
        #         self.fields['service_company'].initial = self.request.user
        #         self.fields['service_company'].disabled = True


class MaintenanceAdminForm(BaseAdminForm):
    class Meta:
        model = Maintenance
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.request and not self.request.user.is_superuser:
            if self.request.user.role == 'SERVICE':
                self.fields['service_company'].queryset = User.objects.filter(pk=self.request.user.pk)
                self.fields['service_company'].initial = self.request.user
                self.fields['service_company'].disabled = True


class ComplaintAdminForm(BaseAdminForm):
    class Meta:
        model = Complaint
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.request and not self.request.user.is_superuser:
            if self.request.user.role == 'SERVICE':
                self.fields['service_company'].queryset = User.objects.filter(pk=self.request.user.pk)
                self.fields['service_company'].initial = self.request.user
                self.fields['service_company'].disabled = True


class BaseAdmin(admin.ModelAdmin):
    def get_form(self, request, obj=None, **kwargs):
        kwargs['form'] = self.form
        form = super().get_form(request, obj, **kwargs)

        # Передаем request в форму
        class RequestForm(form):
            def __new__(cls, *args, **kwargs):
                kwargs['request'] = request
                return form(*args, **kwargs)

        return RequestForm

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        if request.user.is_anonymous:
            return qs.none()

        if isinstance(self, MachineAdmin):
            if request.user.role == 'MANAGER':
                return qs
            if request.user.role == 'CLIENT':
                return qs.filter(client=request.user)
            if request.user.role == 'SERVICE':
                return qs.filter(service_company=request.user)

        elif isinstance(self, (MaintenanceAdmin, ComplaintAdmin)):
            if request.user.role == 'MANAGER':
                return qs
            return qs.filter(service_company=request.user)

        return qs.none()

    def has_view_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if obj:
            return obj.user_has_access(request.user)
        return True

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if obj:
            return obj.user_has_access(request.user)
        return request.user.is_authenticated and request.user.role in ['MANAGER', 'SERVICE']

    def has_add_permission(self, request):
        return request.user.is_authenticated and request.user.role in ['MANAGER', 'SERVICE']

    def has_delete_permission(self, request, obj=None):
        return request.user.is_authenticated and request.user.role == 'MANAGER'


# @admin.register(Machine)
# class MachineAdmin(BaseAdmin):
#     form = MachineAdminForm
#     list_display = ('machine_serial', 'machine_model', 'client', 'service_company')
#     list_filter = ('machine_model', 'client', 'service_company')
#     search_fields = ('machine_serial',)
#
#     def has_add_permission(self, request):
#         # Разрешаем добавление для менеджеров и сервисных компаний
#         return request.user.is_authenticated and request.user.role in ['MANAGER', 'SERVICE']
@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = ('machine_serial', 'machine_model')

    def has_add_permission(self, request):
        return True  # Временно разрешаем всем

@admin.register(Maintenance)
class MaintenanceAdmin(BaseAdmin):
    form = MaintenanceAdminForm
    list_display = ('machine', 'maintenance_type', 'maintenance_date', 'service_company')
    list_filter = ('maintenance_type', 'service_company')
    search_fields = ('work_order',)


@admin.register(Complaint)
class ComplaintAdmin(BaseAdmin):
    form = ComplaintAdminForm
    list_display = ('machine', 'failure_date', 'failure_node', 'service_company')
    list_filter = ('failure_node', 'service_company')
    search_fields = ('failure_description',)


@admin.register(Reference)
class ReferenceAdmin(admin.ModelAdmin):
    list_display = ('name', 'title')
    search_fields = ('title', 'description')

    def has_module_permission(self, request):
        return request.user.is_authenticated and request.user.role == 'MANAGER'

    def has_view_permission(self, request, obj=None):
        return request.user.is_authenticated and request.user.role == 'MANAGER'

    def has_change_permission(self, request, obj=None):
        return request.user.is_authenticated and request.user.role == 'MANAGER'

    def has_add_permission(self, request):
        return request.user.is_authenticated and request.user.role == 'MANAGER'

    def has_delete_permission(self, request, obj=None):
        return request.user.is_authenticated and request.user.role == 'MANAGER'