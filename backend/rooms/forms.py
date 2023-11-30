from django import forms

class RoomCreationForm(forms.Form):
    room_name = forms.CharField(max_length=255)
    owner = forms.UUIDField()
