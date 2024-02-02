from django import forms

class RoomCreationForm(forms.Form):
    name = forms.CharField(max_length=255)
    owner = forms.UUIDField()
