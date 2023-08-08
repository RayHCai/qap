from django import forms


class QuizCreationForm(forms.Form):
    teacher_id = forms.UUIDField()

    name = forms.CharField(max_length=255)
