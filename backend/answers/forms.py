from django import forms
from django.contrib.postgres.forms import SimpleArrayField

class AnswerCreationForm(forms.Form):
    answer_for = forms.UUIDField()

    student_name = forms.CharField(max_length=255)
    
    text_answer = forms.CharField()
    selected = SimpleArrayField(forms.CharField(max_length=255))
