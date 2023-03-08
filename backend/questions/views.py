from rest_framework.views import APIView
from rest_framework.response import Response

from classes.models import Classes

from questions.models import Question
from questions.serializers import QuestionsSerializer

class QuestionsView(APIView):
    def get(self, request, class_code, q_id=None):
        if not class_code:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            c = Classes.objects.get(code=class_code)
        except Classes.DoesNotExist:
            return Response({'message': 'Class not found'}, status=404)

        if q_id:
            try:
                q = Question.objects.filter(c=c)
            except Question.DoesNotExist:
                return Response({'message': 'Question not found'}, status=404)

            return Response({'data': QuestionsSerializer(q).data}, status=200)
        else:
            questions = Question.objects.filter(c=c)

            serialized = []

            for q in questions:
                serialized.append(QuestionsSerializer(q).data)

            return Response({'data': serialized}, status=200)

    def post(self, request, class_code):
        title = request.data.get('title')
        content = request.data.get('content')
        choices = request.data.get('choices')

        if not class_code or not title or not content:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            c = Classes.objects.get(code=class_code)
        except Classes.DoesNotExist:
            return Response({'message': 'Class not found'}, status=404)
        
        Question.objects.create(
            title=title,
            content=content,
            c=c,
            visible=True,
            choices=choices
        )

        return Response({'message': 'Success'}, status=200)

class DeleteQuestionsView(APIView):
    def post(self, request):
        id = request.data.get('id')

        if not id:
            return Response({'message': 'Invalid Request'}, status=400)
        
        try:
            question = Question.objects.get(id=id)
        except Question.DoesNotExist:
            return Response({'message': 'Question does not exist'}, status=404)

        question.delete()

        return Response({'message': 'Success'}, status=200)

class UpdateQuestionsView(APIView):
    def post(self, request):
        id = request.data.get('id')
        change_obj = request.data.get('change')

        if not id or change_obj == None:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            question = Question.objects.get(id=id)
        except Question.DoesNotExist:
            return Response({'message': 'Question does not exist'}, status=404)

        if type(change_obj) == bool:
            question.visible = change_obj
        else:
            if content := change_obj.get('content'):
                question.content = content
            
            if title := change_obj.get('title'):
                question.title = title

        question.save()

        return Response({'message': 'Success'}, status=200)
