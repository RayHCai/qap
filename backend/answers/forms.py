from django import forms

class AnswerCreationForm(forms.Form):
    question_id = forms.UUIDField()

    name = forms.CharField(max_length=255)
    answer = forms.CharField(required=False)
    choice = forms.CharField(required=False)
