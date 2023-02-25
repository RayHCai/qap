from rest_framework.views import APIView
from rest_framework.response import Response

from classes.models import Classes

from questions.models import Question
from questions.serializers import QuestionsSerializer

class QuestionsView(APIView):
    def get(self, request):
        class_code = request.GET.get('class_code')

        if not class_code:
            return Response({'message': 'Invalid request'}, status_code=400)

        try:
            c = Classes.objects.get(code=class_code)
        except Classes.DoesNotExist:
            return Response({'message': 'Class not found'}, status_code=404)
        
        q_id = request.GET.get('id')

        if q_id:
            try:
                q = Question.objects.filter(c=c)
            except Question.DoesNotExist:
                return Response({'message': 'Question not found'}, status_code=404)

            return Response({'data': QuestionsSerializer(q).data}, status_code=200)
        else:
            questions = Question.objects.filter(c=c)

            serialized = []

            for q in questions:
                serialized.append(QuestionsSerializer(q).data)

            return Response({'data': serialized}, status_code=200)

    def post(self, request):
        class_code = request.POST.get('class_code')
        title = request.POST.get('title')
        content = request.POST.get('content')

        if not class_code or not title or not content:
            return Response({'message': 'Invalid request'}, status_code=400)

        try:
            c = Classes.objects.get(code=class_code)
        except Classes.DoesNotExist:
            return Response({'message': 'Class not found'}, status_code=404)
        
        Questions.objects.create(
            title=title,
            content=content,
            c=c
        )

        return Response({'message': 'Success'}, status_code=200)
