from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from users.serializers import UserSerializer
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username
                },
                'token': 'your-generated-token'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






@csrf_exempt
@api_view(['POST'])
def login_view(request):
    # Получаем данные из запроса
    username = request.data.get('username')
    password = request.data.get('password')

    # Проверяем обязательные поля
    if not username or not password:
        return Response(
            {'error': 'Требуется имя пользователя и пароль'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Аутентификация пользователя
    user = authenticate(request, username=username, password=password)

    if user is not None:
        # Генерируем JWT-токены
        refresh = RefreshToken.for_user(user)
        login(request, user)  # Опционально, если нужна сессия

        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Неверные учетные данные'},
            status=status.HTTP_401_UNAUTHORIZED
        )