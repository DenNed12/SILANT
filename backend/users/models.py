from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    ROLES = (
        ('CLIENT', 'Клиент'),
        ('SERVICE', 'Сервисная компания'),
        ('MANAGER', 'Менеджер'),
    )
    role = models.CharField(
        max_length=10,
        choices=ROLES,
        default='CLIENT',
        verbose_name="Роль"
    )
    company = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Компания"
    )

    # Добавляем related_name для разрешения конфликтов
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name="custom_user_set",  # Уникальное имя
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="custom_user_set",  # Уникальное имя
        related_query_name="user",
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"