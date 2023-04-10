from rest_framework.views import APIView
from rest_framework.response import Response

from quizzes.models import Quizzes

from questions.models import Questions
from questions.forms import QuestionCreationForm

def serialize_question(question):
    return {
        'id': question.id,
        'title': question.title,
        'content': question.content,
        'isVisible': question.is_visible,
        'question_for': question.question_for.id,
        'choices': question.choices,
        'selectMultiple': question.select_multiple,
        'correctAnswer': question.correct_answer,
        'required': question.required,
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

        form = QuestionCreationForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid request'}, status=400)

        form_data = form.cleaned_data

        question_for = form_data.get('question_for')

        try:
            quiz_obj = Quizzes.objects.get(id=question_for)
        except Quizzes.DoesNotExist:
            return Response({'message': f'Quiz not found with id { question_for }'}, status=404)
        
        question = Questions.objects.create(
            title=form_data.get('title'),
            content=form_data.get('content'),
            is_visible=form_data.get('is_visible'),
            question_for=quiz_obj,
            choices=form_data.get('choices'),
            correct_answer=form_data.get('correct_answer'),
            select_multiple=form_data.get('select_multiple'),
            required=form_data.get('required'),
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
        Updaet question from id
        '''
        
        change_obj = request.data.get('change_obj')

        if not change_obj or not question_id:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            question = Questions.objects.get(id=question_id)
        except Questions.DoesNotExist:
            return Response({'message': f'Question does not exist with id { question_id }'}, status=404)

        question.title = change_obj.get('title')
        question.content = change_obj.get('content')

        question.is_visible = change_obj.get('is_visible')

        question.choices = change_obj.get('choices')

        question.select_multiple = change_obj.get('select_multiple')
        question.correct_answer = change_obj.get('correct_answer')

        question.required = change_obj.get('required')

        question.save()

        return Response({'data': serialize_question(question)}, status=200)
