from django import forms

class AnswerCreationForm(forms.Form):
    answer = forms.TextField()
    
    question_id = forms.UUIDField()
    username = forms.CharField(blank=True, max_length=255)
    correct = forms.BooleanField()
