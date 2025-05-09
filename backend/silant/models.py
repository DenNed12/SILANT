from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied

User = get_user_model()


class AccessMixin:
    """Миксин для проверки прав доступа"""

    def user_has_access(self, user):
        if user.is_superuser:
            return True
        if user.is_anonymous:
            return False

        # Для Machine
        if isinstance(self, Machine):
            if user.role == 'MANAGER':
                return True
            if user.role == 'CLIENT' and self.client == user:
                return True
            if user.role == 'SERVICE' and self.service_company == user:
                return True

        # Для Maintenance и Complaint
        elif isinstance(self, (Maintenance, Complaint)):
            if user.role == 'MANAGER':
                return True
            if self.machine.user_has_access(user):
                return True
            if user.role == 'SERVICE' and self.service_company == user:
                return True

        return False
class Reference(AccessMixin,models.Model):
    """Модель для хранения справочных данных (типы техники, узлы отказа и т.д.)"""
    name = models.CharField(max_length=100, verbose_name="Название справочника")
    title = models.CharField(max_length=100, verbose_name="Название элемента")
    description = models.TextField(blank=True, verbose_name="Описание")

    def user_has_access(self, user):
        return user.is_authenticated and user.role == 'MANAGER'

    def __str__(self):
        return f"{self.name}: {self.title}"

    class Meta:
        verbose_name = "Справочник"
        verbose_name_plural = "Справочники"




class Machine(AccessMixin,models.Model):
    """Модель техники (погрузчики «Силант»)"""
    machine_serial = models.CharField(max_length=50, unique=True, verbose_name="Зав. № машины")
    machine_model = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name="machine_models",
        verbose_name="Модель техники"
    )
    engine_model = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name="engine_models",
        verbose_name="Модель двигателя"
    )
    engine_serial = models.CharField(max_length=50, verbose_name="Зав. № двигателя")
    transmission_model = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name="transmission_models",
        verbose_name="Модель трансмиссии"
    )
    transmission_serial = models.CharField(max_length=50, verbose_name="Зав. № трансмиссии")
    drive_axle_model = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name="drive_axle_models",
        verbose_name="Модель ведущего моста"
    )
    drive_axle_serial = models.CharField(max_length=50, verbose_name="Зав. № ведущего моста")
    steering_axle_model = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name="steering_axle_models",
        verbose_name="Модель управляемого моста"
    )
    steering_axle_serial = models.CharField(max_length=50, verbose_name="Зав. № управляемого моста")
    supply_contract = models.CharField(max_length=100, verbose_name="Договор поставки №, дата")
    shipping_date = models.DateField(verbose_name="Дата отгрузки с завода")
    consignee = models.CharField(max_length=200, verbose_name="Грузополучатель")
    delivery_address = models.CharField(max_length=200, verbose_name="Адрес поставки")
    equipment = models.TextField(verbose_name="Комплектация (доп. опции)")
    client = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="machines",
        verbose_name="Клиент"
    )
    service_company = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="serviced_machines",
        verbose_name="Сервисная компания"
    )

    def __str__(self):
        return f"{self.machine_model.title} (№{self.machine_serial})"

    def get_visible_fields(self, user):
        base_fields = [
            'machine_serial', 'machine_model', 'engine_model',
            'engine_serial', 'transmission_model', 'transmission_serial',
            'drive_axle_model', 'drive_axle_serial', 'steering_axle_model',
            'steering_axle_serial'
        ]
        if user.is_authenticated:
            return base_fields + [
                'supply_contract', 'shipping_date', 'consignee',
                'delivery_address', 'equipment', 'client', 'service_company'
            ]
        return base_fields

    class Meta:
        verbose_name = "Машина"
        verbose_name_plural = "Машины"



class Maintenance(AccessMixin,models.Model):
    """Модель технического обслуживания"""
    maintenance_type = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name="maintenance_types",
        verbose_name="Вид ТО"
    )
    maintenance_date = models.DateField(verbose_name="Дата проведения ТО")
    operating_hours = models.PositiveIntegerField(verbose_name="Наработка, м/час")
    work_order = models.CharField(max_length=50, verbose_name="№ заказ-наряда")
    work_order_date = models.DateField(verbose_name="Дата заказ-наряда")
    maintenance_company = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name="maintenance_companies",
        verbose_name="Организация, проводившая ТО"
    )
    machine = models.ForeignKey(
        Machine,
        on_delete=models.CASCADE,
        related_name="maintenances",
        verbose_name="Машина"
    )
    service_company = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="maintenance_orders",
        verbose_name="Сервисная компания"
    )

    def get_visible_fields(self, user):
        if user.is_anonymous:
            return []
        return [f.name for f in self._meta.fields]
    def __str__(self):
        return f"ТО {self.maintenance_type.title} для {self.machine}"

    class Meta:
        verbose_name = "Техническое обслуживание"
        verbose_name_plural = "Технические обслуживания"



class Complaint(AccessMixin,models.Model):
    """Модель рекламаций (отказов и их устранения)"""
    failure_date = models.DateField(verbose_name="Дата отказа")
    operating_hours = models.PositiveIntegerField(verbose_name="Наработка, м/час")
    failure_node = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name="failure_nodes",
        verbose_name="Узел отказа"
    )
    failure_description = models.TextField(verbose_name="Описание отказа")
    recovery_method = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name="recovery_methods",
        verbose_name="Способ восстановления"
    )
    spare_parts = models.TextField(blank=True, verbose_name="Используемые запасные части")
    recovery_date = models.DateField(verbose_name="Дата восстановления")
    downtime = models.PositiveIntegerField(
        editable=False,
        verbose_name="Время простоя техники (дни)"
    )
    machine = models.ForeignKey(
        Machine,
        on_delete=models.CASCADE,
        related_name="complaints",
        verbose_name="Машина"
    )
    service_company = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="complaints",
        verbose_name="Сервисная компания"
    )

    def save(self, *args, **kwargs):
        self.downtime = (self.recovery_date - self.failure_date).days
        super().save(*args, **kwargs)

    def get_visible_fields(self, user):
        if user.is_anonymous:
            return []
        return [f.name for f in self._meta.fields]
    def __str__(self):
        return f"Рекламация по {self.machine} ({self.failure_node.title})"

    class Meta:
        verbose_name = "Рекламация"
        verbose_name_plural = "Рекламации"