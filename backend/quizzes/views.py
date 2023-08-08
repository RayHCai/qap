from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Quizzes
from .forms import QuizCreationForm

from users.models import Users


class QuizzesView(APIView):
    def get(self, request, quiz_id):
        '''
        Get quiz by id
        '''

        if not quiz_id:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            quiz_obj = Quizzes.objects.get(id=quiz_id)
        except Quizzes.DoesNotExist:
            return Response({'message': f'Quiz not found with id { quiz_id }'}, status=404)

        serialized_quiz = {
            'id': quiz_obj.id,
            'name': quiz_obj.name,
            'teacher': quiz_obj.teacher.id,
        }

        return Response({'data': serialized_quiz}, status=200)

    def post(self, request):
        '''
        Create a quiz
        '''

        form = QuizCreationForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid request'}, status=400)

        form_data = form.cleaned_data

        teacher_id = form_data.get('teacher_id')

        try:
            teacher = Users.objects.get(id=teacher_id)
        except Users.DoesNotExist:
            return Response({'message': f'User does not exist with id { teacher_id }'})

        quiz_name = form_data.get('name')

        if Quizzes.objects.filter(name=quiz_name, teacher=teacher).exists():
            return Response({'message': f'You already have a quiz with name { quiz_name }'}, status=400)

        q = Quizzes.objects.create(
            name=quiz_name,
            teacher=teacher,
        )

        return Response({'data': q.id}, status=200)


class TeacherQuizzesView(APIView):
    def get(self, request, teacher_id):
        '''
        Get all quizzes from a teacher
        '''

        if not teacher_id:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            teacher = Users.objects.get(id=teacher_id)
        except Users.DoesNotExist:
            return Response({'message': f'User does not exist with id { teacher_id }'}, status=404)

        quizzes = Quizzes.objects.filter(teacher=teacher)

        serialized_quizzes = []

        for quiz in quizzes:
            serialized_quizzes.append(
                {
                    'id': quiz.id,
                    'name': quiz.name,
                    'teacher': quiz.teacher.id,
                }
            )

        return Response({'data': serialized_quizzes}, status=200)


class DeleteQuizView(APIView):
    def post(self, request, quiz_id):
        '''
        Delete quiz from id
        '''

        if not quiz_id:
            return Response({'message': 'Invalid request'}, status=400)

        try:
            quiz = Quizzes.objects.get(id=quiz_id)
        except Quizzes.DoesNotExist:
            return Response({'message': f'Quiz does not exist with id { quiz_id }'}, status=404)

        quiz.delete()

        return Response({'message': 'Success'}, status=200)
