from django.contrib import admin
from django.urls import path

from classes.views import ClassViews, CreateClassViews, ValidateTeacherViews
from questions.views import QuestionsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('classes/<str:class_code>/', ClassViews.as_view()),
    path('classes/', CreateClassViews.as_view()),
    path('validate/', ValidateTeacherViews.as_view()),
    path('questions/<str:class_code>/', QuestionsView.as_view()),
    path('questions/<str:class_code>/<uuid:q_id>/', QuestionsView.as_view()),
]
