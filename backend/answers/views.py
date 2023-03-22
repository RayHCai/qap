from rest_framework.views import APIView
from rest_framework.response import Response

from answers.models import Answers
from answers.forms import AnswerCreationForm

from questions.models import Question

from classes.models import Classes

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

        if question.select_multiple:
            correct = True
            chosen = question.correct_answer.split(',')
            selected = form_data.get('choice').split(',')

            chosen.sort()
            selected.sort()

            if len(chosen) != len(selected):
                correct = False
            else:
                for i in range(len(chosen)):
                    if chosen[i] != selected[i]:
                        correct = False

                        break

        Answers.objects.create(
            question=question,
            name=form_data.get('name'),
            answer=form_data.get('answer'),
            choice=form_data.get('choice'),
            correct=correct,
        )

        return Response({'message': 'Success'}, status=200)

class GetAnswerView(APIView):
    def get(self, request, class_code):
        try:
            c = Classes.objects.get(code=class_code)
        except Classes.DoesNotExist:
            return Response({'message': 'Class does not exist'}, status=404)

        all_questions = Question.objects.filter(c=c)

        total_serialized = {}

        for question in all_questions:
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
            
            total_serialized[question.title] = serialized_answers

        return Response({'data': total_serialized}, status=200)
