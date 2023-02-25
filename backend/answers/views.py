from rest_framework.views import APIView
from rest_framework.response import Response

from answers.models import Answers
from answers.forms import AnswerCreationForm

from questions.models import Questions

class AnswerViews(APIView):
    def get(self, request):
        pass

    def post(self, request):
        form = AnswerCreationForm(request.POST)

        if not form.is_valid():
            return Response({'message': 'Invalid Request'}, status=400)

        form_data = form.cleaned_data

        try:
            question = Questions.objects.get(id=form_data.get('question_id'))
        except Questions.DoesNotExist:
            return Response({'message': 'Question does not exist'}, status=404)

        Answers.ojects.create(
            answer=form_data.get('answer'),
            question=question,
            username=form_data.get('username'),
            correct=form_data.get('correct')
        )

        return Response({'message', 'Success'}, status=200)
