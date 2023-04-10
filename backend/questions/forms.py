from django import forms
from django.contrib.postgres.forms import SimpleArrayField

class QuestionCreationForm(forms.Form):
    title = forms.CharField(max_length=255)
    content = forms.CharField()
    
    is_visible = forms.BooleanField(initial=True)
    
    question_for = forms.UUIDField()
    
    choices = SimpleArrayField(forms.CharField(max_length=255))
    correct_answer = forms.CharField(required=False)

    select_multiple = forms.BooleanField()
    required = forms.BooleanField(initial=True)
