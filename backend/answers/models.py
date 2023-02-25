import uuid

from django.db import models

from questions.models import Question

class Answers(models.Model):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        blank=False,
        default=uuid.uuid4,
        editable=False
    )

    answer = models.TextField(blank=True)
    date_answered = models.DateTimeField(auto_now_add=True)

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    username = models.CharField(max_length=255)

    correct = models.BooleanField()
    