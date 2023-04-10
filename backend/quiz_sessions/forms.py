from django import forms

class QuizSessionCreationForm(forms.Form):
    code = forms.CharField(max_length=255, required=False)
    session_for = forms.UUIDField()

class QuizSessionJoinForm(forms.Form):
    student_name = forms.CharField(max_length=255)
    session_code = forms.CharField(max_length=255)
