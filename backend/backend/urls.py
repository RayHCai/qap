from django.contrib import admin
from django.urls import path

from quizzes.views import QuizzesView, TeacherQuizzesView, DeleteQuizView
from questions.views import QuestionsView, DeleteQuestionsView, UpdateQuestionsView
from answers.views import AnswersView, AnswersFromSessionView
from users.views import UsersView, ValidateUserView
from quiz_sessions.views import QuizSessionsView, JoinSessionView, AllSessionsView, TerminateSessionView, QuizSessionsView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('quizzes/manage/<uuid:quiz_id>/', QuizzesView.as_view()),
    path('quizzes/manage/', QuizzesView.as_view()),
    path('quizzes/delete/<uuid:quiz_id>/', DeleteQuizView.as_view()),
    path('quizzes/teacher/<uuid:teacher_id>/', TeacherQuizzesView.as_view()),

    path('questions/manage/<uuid:quiz_id>/', QuestionsView.as_view()),
    path('questions/manage/<uuid:quiz_id>/<uuid:question_id>/',
         QuestionsView.as_view()),
    path('questions/manage/', QuestionsView.as_view()),
    path('questions/delete/<uuid:question_id>/', DeleteQuestionsView.as_view()),
    path('questions/update/<uuid:question_id>/', UpdateQuestionsView.as_view()),

    path('answers/manage/<uuid:question_id>/', AnswersView.as_view()),
    path('answers/manage/', AnswersView.as_view()),
    path('answers/getfromsession/<str:session_id>/',
         AnswersFromSessionView.as_view()),

    path('users/manage/<uuid:user_id>/', UsersView.as_view()),
    
    path('auth/signup/', UsersView.as_view()),
    path('auth/validate/', ValidateUserView.as_view()),

    path('sessions/manage/<str:session_code>/', QuizSessionsView.as_view()),
    path('sessions/manage/', QuizSessionsView.as_view()),
    path('sessions/all/<str:quiz_id>/', AllSessionsView.as_view()),
    path('sessions/join/', JoinSessionView.as_view()),
    path('sessions/terminate/<str:session_id>/',
         TerminateSessionView.as_view()),
]
