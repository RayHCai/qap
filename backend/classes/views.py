import hashlib

from rest_framework.views import APIView
from rest_framework.response import Response

from classes.models import Classes
from classes.forms import ClassCreationForm

class ClassViews(APIView):
    def get(self, request, class_code):
        if not class_code:
            return Response({'message': 'Invalid request'}, status=400)
        
        try:
            user_class = Classes.objects.get(code=class_code)
        except Classes.DoesNotExist:
            return Response({'message': 'Class not found'}, status=404)

        return Response({'data': user_class.code}, status=200)

class CreateClassViews(APIView):
    def post(self, request):
        form = ClassCreationForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid request'}, status=400)
        
        form = form.cleaned_data

        if Classes.objects.filter(code=form.get('code')).exists():
            return Response({'message': 'Class exists with code'}, status=400)

        Classes.objects.create(
            password=hashlib.sha256(form.get('password').encode('utf-8')).hexdigest(),
            code=form.get('code')
        )

        return Response({'message': 'Success'}, status=200)

class ValidateTeacherViews(APIView):
    def post(self, request):
        class_code = request.data.get('code')
        password = request.data.get('password')

        if not class_code or not password:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            user_class = Classes.objects.get(code=class_code)
        except Classes.DoesNotExist:
            return Response({'message': 'Class not found'}, status=404)

        if user_class.password != hashlib.sha256(password.encode('utf-8')).hexdigest():
            return Response({'message': 'Password invalid'}, status=400)

        return Response({'message': 'Success'}, status=200)
