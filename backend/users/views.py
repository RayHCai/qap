import hashlib

from rest_framework.mixins import CreateModelMixin
from rest_framework.generics import GenericAPIView

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Users
from .forms import UserCreationForm, UserValidationForm
from .serializers import UserSerializer


class UsersView(CreateModelMixin, GenericAPIView):
    serializer_class = UserSerializer
    queryset = Users.objects.all()

    def get(self, request, user_id):
        '''
        Get user from id
        '''

        if not user_id:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            user = Users.objects.get(id=user_id)
        except Users.DoesNotExist:
            return Response({'message': 'User with id does not exist'}, status=404)

        serialized_user = UserSerializer(user).data

        return Response(serialized_user, status=200)

    def post(self, request):
        '''
        Create new user
        '''
        
        form = UserCreationForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid request'}, status=400)
        

        form_data = form.cleaned_data

        password = form_data.get('password')
        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
        
        user = Users.objects.create(
            username=form_data.get('username'),
            email=form_data.get('email'),
            password=hashed_password,
        )

        serialized_user = UserSerializer(user).data

        return Response(serialized_user, status=200)


class ValidateUserView(APIView):
    def post(self, request):
        '''
        Validate user with email/password
        '''

        form = UserValidationForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid request'}, status=400)

        form_data = form.cleaned_data

        email = form_data.get('email')

        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            return Response({'message': f'User does not exist with email { email }'}, status=404)

        password = form_data.get('password')
        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()

        user_verified = user.password == hashed_password

        if not user_verified:
            return Response({'message': 'Invalid credentials'}, status=400)

        return Response(UserSerializer(user).data, status=200)
