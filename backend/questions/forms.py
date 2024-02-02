from django import forms


class QuestionCreationForm(forms.Form):
    content = forms.CharField(required=False)

    question_for = forms.UUIDField()
    question_type = forms.CharField()
    num_points = forms.IntegerField()

    choices = forms.CharField(required=False)
    correct_answers = forms.CharField(required=False)
