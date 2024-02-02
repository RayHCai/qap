from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Answers
from .forms import AnswerCreationForm

from questions.models import Questions
from quiz_sessions.models import QuizSessions


def serialize_answer(answer):
    return {
        'answeredBy': answer.answered_by,
        'answerFor': answer.answer_for.id,
        'textAnswer': answer.text_answer,
        'selected': answer.selected,
        'correct': answer.correct,
        'dateAnswered': answer.date_answered,
    }


class AnswersView(APIView):
    def get(self, request, question_id):
        '''
        Get all answers for a given question
        '''

        try:
            question = Questions.objects.get(id=question_id)
        except Questions.DoesNotExist:
            return Response({'message': f'Question does not exist with id { question_id }'}, status=404)

        serialized_answers = []

        for answer in Answers.objects.filter(answer_for=question):
            serialized_answers.append(serialize_answer(answer))

        return Response({'data': serialized_answers}, status=200)

    def post(self, request):
        '''
        Create an answer
        '''

        form = AnswerCreationForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid Request'}, status=400)

        form_data = form.cleaned_data

        answer_for = form_data.get('answer_for')

        try:
            question = Questions.objects.get(id=answer_for)
        except Questions.DoesNotExist:
            return Response({'message': f'Question does not exist with id { answer_for }'}, status=404)

        session_for = form_data.get('session_for')

        try:
            session = QuizSessions.objects.get(id=session_for)
        except QuizSessions.DoesNotExist:
            return Response({'message': f'Session does not exist with id { session_for }'}, status=404)

        selected = request.data.get('selected')

        if not question.choices:
            correct = False
        else:
            if len(question.correct_answers) == 1:
                correct = question.correct_answers[0] == selected[0]
            else:
                correct = True

                correct_choices = question.correct_answers
                selected_choices = selected

                correct_choices.sort()
                selected_choices.sort()

                if len(correct_choices) != len(selected_choices):
                    correct = False
                else:
                    for choice, selected_option in zip(correct_choices, selected_choices):
                        if choice != selected_option:
                            correct = False

                            break

        answer = Answers.objects.create(
            answer_for=question,
            answered_by=form_data.get('answered_by'),
            text_answer=form_data.get('text_answer'),
            selected=selected,
            correct=correct,
            session_for=session,
        )

        return Response({'data': serialize_answer(answer)}, status=200)


class AnswersFromSessionView(APIView):
    def get(self, request, session_id):
        '''
        Get all answers from session
        '''

        if not session_id:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            session = QuizSessions.objects.get(id=session_id)
        except QuizSessions.DoesNotExist:
            return Response({'message': f'Session does not exist with id { session_id }'}, status=404)

        answers = Answers.objects.filter(session_for=session)

        serialized_answers = []

        for answer in answers:
            serialized_answers.append(serialize_answer(answer))

        return Response({'data': serialized_answers}, status=200)
