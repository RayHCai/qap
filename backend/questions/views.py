
from rest_framework.views import APIView
from rest_framework.response import Response

from quizzes.models import Quizzes

from .models import Questions
from .forms import QuestionCreationForm


def serialize_question(question):
    return {
        'id': question.id,
        'content': question.content,
        'question_for': question.question_for.id,
        'choices': question.choices,
        'correctAnswers': question.correct_answers,
        'questionType': question.question_type,
        'numPoints': question.num_points,
    }


class QuestionsView(APIView):
    def get(self, request, quiz_id, question_id=None):
        '''
        Get question from id or get all questions from quiz
        '''

        if not quiz_id and not question_id:
            return Response({'message': 'Invalid request'}, status=400)

        if question_id:
            try:
                question = Questions.objects.filter(id=question_id)
            except Questions.DoesNotExist:
                return Response({'message': f'Question not found with id { question_id }'}, status=404)

            return Response({'data': serialize_question(question)}, status=200)
        else:
            try:
                quiz_obj = Quizzes.objects.get(id=quiz_id)
            except Quizzes.DoesNotExist:
                return Response({'message': f'Quiz not found with id { quiz_id }'}, status=404)

            questions = Questions.objects.filter(question_for=quiz_obj)

            serialized_questions = []

            for question in questions:
                serialized_questions.append(serialize_question(question))

            data = {
                'questions': serialized_questions,
                'quiz': {
                    'id': quiz_obj.id,
                    'name': quiz_obj.name,
                    'teacher': quiz_obj.teacher.id,
                }
            }

            return Response({'data': data}, status=200)

    def post(self, request):
        '''
        Create a question for a quiz
        '''

        print(request.data)

        form = QuestionCreationForm({
            **request.data,
            'choices': '',  # json.dumps(request.data.get('choices')),
            # json.dumps(request.data.get('correct_answer')),
            'correct_answers': ''
        })

        # print(form.is_valid(), form.errors.as_data())

        if not form.is_valid():
            return Response({'message': 'Invalid request'}, status=400)

        form_data = form.cleaned_data

        question_for = form_data.get('question_for')

        try:
            quiz_obj = Quizzes.objects.get(id=question_for)
        except Quizzes.DoesNotExist:
            return Response({'message': f'Quiz not found with id { question_for }'}, status=404)

        question = Questions.objects.create(
            content=form_data.get('content'),
            question_for=quiz_obj,
            choices=request.data.get('choices'),
            correct_answers=request.data.get('correct_answers'),
            question_type=form_data.get('question_type'),
            num_points=form_data.get('num_points'),
        )

        return Response({'data': serialize_question(question)}, status=200)


class DeleteQuestionsView(APIView):
    def post(self, request, question_id):
        '''
            Delete question from id
        '''

        if not question_id:
            return Response({'message': 'Invalid Request'}, status=400)

        try:
            question = Questions.objects.get(id=question_id)
        except Questions.DoesNotExist:
            return Response({'message': f'Question does not exist { question_id }'}, status=404)

        question.delete()

        return Response({'message': 'Success'}, status=200)


class UpdateQuestionsView(APIView):
    def post(self, request, question_id):
        '''
        Update question from id
        '''

        change_obj = request.data.get('change_obj')

        if not change_obj or not question_id:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            question = Questions.objects.get(id=question_id)
        except Questions.DoesNotExist:
            return Response({'message': f'Question does not exist with id { question_id }'}, status=404)

        question.content = change_obj.get('content')

        question.choices = change_obj.get('choices')
        question.correct_answers = change_obj.get('correct_answers')

        question.question_type = change_obj.get('question_type')
        question.num_points = change_obj.get('num_points')

        question.save()

        return Response({'data': serialize_question(question)}, status=200)
