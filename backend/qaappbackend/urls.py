from django.contrib import admin
from django.urls import path

from classes.views import ClassViews, CreateClassViews
from questions.views import QuestionsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('classes/<str:class_id>/', ClassViews.as_view()),
    path('classes/', CreateClassViews.as_view()),
    path('questions/', QuestionsView.as_view()),
]
