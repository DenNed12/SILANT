from .models import *
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import MachineSerializer

class BaseAccessPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return obj.user_has_access(request.user)
        return obj.user_has_access(request.user) and request.user.role in ['MANAGER', 'SERVICE']


class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    permission_classes = [BaseAccessPermission]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        if user.is_anonymous:
            return qs.none()
        if user.is_superuser or user.role == 'MANAGER':
            return qs
        if user.role == 'CLIENT':
            return qs.filter(client=user)
        if user.role == 'SERVICE':
            return qs.filter(service_company=user)
        return qs.none()


class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    permission_classes = [BaseAccessPermission]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        if user.is_anonymous:
            return qs.none()
        if user.is_superuser or user.role == 'MANAGER':
            return qs
        return qs.filter(service_company=user)


class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    permission_classes = [BaseAccessPermission]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        if user.is_anonymous:
            return qs.none()
        if user.is_superuser or user.role == 'MANAGER':
            return qs
        return qs.filter(service_company=user)


class ReferenceViewSet(viewsets.ModelViewSet):
    queryset = Reference.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'role': user.role,
            'company': user.company
        })


class ClientMachinesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'CLIENT':
            return Response({'detail': 'Forbidden'}, status=403)

        machines = Machine.objects.filter(client=request.user)
        serializer = MachineSerializer(machines, many=True, context={'request': request})
        return Response(serializer.data)


class ServiceCompanyMachinesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'SERVICE':
            return Response({'detail': 'Forbidden'}, status=403)

        machines = Machine.objects.filter(service_company=request.user)
        serializer = MachineSerializer(machines, many=True, context={'request': request})
        return Response(serializer.data)