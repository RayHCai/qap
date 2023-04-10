from rest_framework.views import APIView
from rest_framework.response import Response

from quiz_sessions.models import QuizSessions
from quiz_sessions.forms import QuizSessionCreationForm, QuizSessionJoinForm

from quizzes.models import Quizzes

def serialize_session(session):
    return {
        'id': session.id,
        'code': session.code,
        'dateCreated': session.date_created,
        'sessionFor': session.session_for.id,
        'usersInSession': session.users_in_session,
    }

class QuizSessionsView(APIView):
    def get(self, request, session_code):
        '''
        Get session from code
        '''

        if not session_code:
            return Response({'message': 'Invalid request'}, status=400)
        
        try:
            session = QuizSessions.objects.get(code=session_code, active=True)
        except QuizSessions.DoesNotExist:
            return Response({'message': f'Session does not exist with code { session_code }'}, status=404)

        return Response({'data': serialize_session(session)}, status=200)

    def post(self, request):
        '''
        Create session
        '''

        form = QuizSessionCreationForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid request'}, status=400)

        form_data = form.cleaned_data

        session_for = form_data.get('session_for')

        try:
            quiz_obj = Quizzes.objects.get(id=session_for)
        except Quizzes.DoesNotExist:
            return Response({'message': f'Quiz does not exist with id { session_for }'}, status=404)

        # ! Need to handle case where sessions with multiple codes exists!!!!!

        session = QuizSessions.objects.create(
            code=quiz_obj.name,
            active=True,
            session_for=quiz_obj,
        )

        return Response({'data': serialize_session(session)}, status=200)

class JoinSessionView(APIView):
    def post(self, request):
        '''
        Add student to a session
        '''

        form = QuizSessionJoinForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid request'}, status=400)

        form_data = form.cleaned_data

        session_code = form_data.get('session_code')

        try:
            session = QuizSessions.objects.get(code=session_code)
        except QuizSessions.DoesNotExist:
            return Response({'message': f'Session with code { session_code } does not exist.'}, status=404)

        session.users_in_session.append(form_data.get('student_name'))

        session.save()
        session.refresh_from_db()

        return Response({'data': serialize_session(session)}, status=200)
