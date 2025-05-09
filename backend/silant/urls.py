from django.urls import path
from views import *
from rest_framework.routers import DefaultRouter
from .views import (
    MachineViewSet,
    MaintenanceViewSet,
    ComplaintViewSet,
    ReferenceViewSet,
    CurrentUserView,
    ClientMachinesView,
    ServiceCompanyMachinesView
)

router = DefaultRouter()
router.register(r'machines', MachineViewSet, basename='machine')
router.register(r'maintenances', MaintenanceViewSet, basename='maintenance')
router.register(r'complaints', ComplaintViewSet, basename='complaint')
router.register(r'references', ReferenceViewSet, basename='reference')

urlpatterns = [
    path('user/me/', CurrentUserView.as_view(), name='current-user'),
    path('user/machines/', ClientMachinesView.as_view(), name='client-machines'),
    path('service/machines/', ServiceCompanyMachinesView.as_view(), name='service-machines'),
] + router.urls