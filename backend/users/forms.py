from django import forms

class UserCreationForm(forms.Form):
    username = forms.CharField(max_length=255)
    email = forms.EmailField()
    password = forms.CharField(max_length=255)

class UserValidationForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField()
