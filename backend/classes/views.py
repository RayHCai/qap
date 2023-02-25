import hashlib

from rest_framework.views import APIView
from rest_framework.response import Response

from classes.models import Classes
from classes.forms import ClassCreationForm
from classes.serializers import ClassesSerializer

class ClassViews(APIView):
    def get(self, request, class_id):
        if not class_id:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            user_class = Classes.objects.get(code=class_id)
        except Classes.DoesNotExist:
            return Response({'message': 'Class not found'}, status=404)
        
        serialized_class = ClassesSerializer(user_class)

        return Response({'data': serialized_class.data}, status=200)

class CreateClassViews(APIView):
    def post(self, request):
        form = ClassCreationForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid request'}, status=400)
        
        form = form.cleaned_data

        if Classes.objects.filter(code=form.get('code')).exists():
            return Response({'message': 'Class exists with code'}, status=400)

        Classes.objects.create(
            password=hashlib.sha256(form.get('password').encode('utf-8')),
            code=form.get('code')
        )

        return Response({'message': 'Success'}, status=200)
