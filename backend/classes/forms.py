from django import forms

class ClassCreationForm(forms.Form):
    code = forms.CharField(max_length=255)
    password = forms.CharField(max_length=255)
