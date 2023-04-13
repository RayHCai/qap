from django import forms
from django.contrib.postgres.forms import SimpleArrayField

from questions.models import Questions

class QuestionCreationForm(forms.Form):
    title = forms.CharField(max_length=255)
    content = forms.CharField()
    
    question_for = forms.UUIDField()
    quesiton_type = forms.ChoiceField(choices=Questions.QuestionTypeChoices)
    num_points = forms.IntegerField()

    choices = SimpleArrayField(forms.CharField(max_length=255))
    correct_answer = forms.CharField(required=False)
