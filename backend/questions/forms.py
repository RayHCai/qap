from django import forms


class QuestionCreationForm(forms.Form):
    title = forms.CharField(max_length=255)
    content = forms.CharField(required=False)

    question_for = forms.UUIDField()
    question_type = forms.CharField()
    num_points = forms.IntegerField()

    choices = forms.CharField(required=False)
    correct_answer = forms.CharField(required=False)
