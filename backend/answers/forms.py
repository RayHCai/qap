from django import forms


class AnswerCreationForm(forms.Form):
    answer_for = forms.UUIDField()
    session_for = forms.UUIDField()

    answered_by = forms.CharField(max_length=255)

    text_answer = forms.CharField(required=False)
    selected = forms.CharField(required=False)
