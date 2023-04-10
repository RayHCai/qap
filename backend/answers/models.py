import uuid

from django.db import models
from django.contrib.postgres.fields import ArrayField

from questions.models import Questions

class Answers(models.Model):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        blank=False,
        default=uuid.uuid4,
        editable=False
    )

    student_name = models.CharField(max_length=255)

    answer_for = models.ForeignKey(Questions, on_delete=models.CASCADE)

    text_answer = models.TextField(blank=True)
    selected = ArrayField(
        models.CharField(max_length=255),
    )

    correct = models.BooleanField()
    
    date_answered = models.DateTimeField(auto_now_add=True)
