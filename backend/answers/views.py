from rest_framework.views import APIView
from rest_framework.response import Response

from answers.models import Answers
from answers.forms import AnswerCreationForm

from questions.models import Question

class CreateAnswerView(APIView):
    def post(self, request):
        form = AnswerCreationForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid Request'}, status=400)

        form_data = form.cleaned_data

        try:
            question = Question.objects.get(id=form_data.get('question_id'))
        except Question.DoesNotExist:
            return Response({'message': 'Question does not exist'}, status=404)

        correct = False

        if question.correct_answer and question.correct_answer == form_data.get('choice'):
            correct = True

        # TODO: need to handle case where multiple options are correct.

        Answers.ojects.create(
            question=question,
            name=form_data.get('name'),
            answer=form_data.get('answer'),
            choice=form_data.get('choice'),
            correct=correct,
        )

        return Response({'message': 'Success'}, status=200)

class GetAnswerView(APIView):
    def get(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            return Response({'message': 'Question not found'}, status=404)

        answers = Answers.objects.filter(question=question)

        serialized_answers = []

        for a in answers:
            serialized_answers.append({
                'date_answered': a.date_answered,
                'answer': a.answer,
                'choice': a.choice,
                'correct': a.correct,
                'name': a.name,
            })

        return Response({'data': serialized_answers}, status=200)
