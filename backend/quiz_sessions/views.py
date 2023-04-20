from rest_framework.views import APIView
from rest_framework.response import Response

from .models import QuizSessions
from .forms import QuizSessionCreationForm, QuizSessionJoinForm

from quizzes.models import Quizzes
from questions.models import Questions
from answers.models import Answers

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

        if Questions.objects.filter(question_for=quiz_obj).count() == 0:
            return Response({'message': 'Quiz needs at least one question'}, status=400)

        if (prev_session := QuizSessions.objects.filter(session_for=quiz_obj, active=False)).exists():
            prev_session = prev_session.first()
            prev_session.active = True
            
            prev_session.save()
            prev_session.refresh_from_db()

            return Response({'data': serialize_session(prev_session)}, status=200)

        session = QuizSessions.objects.create(
            code=form_data.get('code') if form_data.get('code') else quiz_obj.name,
            active=True,
            session_for=quiz_obj,
            users_in_session=[],
        )

        return Response({'data': serialize_session(session)}, status=200)

class AllSessionsView(APIView):
    def get(self, request, quiz_id):
        '''
        Get all sessions for a quiz
        '''

        if not quiz_id:
            return Response({'message': 'Invalid request'}, status=400)
        
        try:
            quiz = Quizzes.objects.get(id=quiz_id)
        except Quizzes.DoesNotExist:
            return Response({'message': 'Quiz does not exist'}, status=404)

        sessions = QuizSessions.objects.filter(session_for=quiz, active=True)

        serialized_sessions = []

        for session in sessions:
            serialized_sessions.append(serialize_session(session))

        return Response({'data': serialized_sessions}, status=200)

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
            session = QuizSessions.objects.get(code=session_code, active=True)
        except QuizSessions.DoesNotExist:
            return Response({'message': f'An active session with code { session_code } does not exist.'}, status=404)

        student_name = form_data.get('student_name')

        answers = Answers.objects.filter(session_for=session, student_name=student_name)
        num_questions = Questions.objects.filter(question_for=session.session_for).count()

        if num_questions == answers.count():
            return Response({'data': {'completed': True}}, status=200)

        if student_name not in session.users_in_session:
            session.users_in_session.append(student_name)

            session.save()
            session.refresh_from_db()

        return Response({'data': serialize_session(session)}, status=200)

class TerminateSessionView(APIView):
    def post(self, request, session_id):
        '''
        Terminate a session
        '''

        if not session_id:
            return Response({'message': 'Invalid request'}, status=400)
        
        try:
            session = QuizSessions.objects.get(id=session_id)
        except QuizSessions.DoesNotExist:
            return Response({'message': f'Session does not exist with id { session_id }'}, status=404)

        session.active = False
        session.users_in_session = []

        session.save()
        session.refresh_from_db()

        return Response({'data': serialize_session(session)}, status=200)
