import uuid

from django.db import models
from django.contrib.postgres.fields import ArrayField

from quizzes.models import Quizzes


class Questions(models.Model):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        blank=False,
        default=uuid.uuid4,
        editable=False
    )

    content = models.TextField()

    question_for = models.ForeignKey(Quizzes, on_delete=models.CASCADE)

    class QuestionTypeChoices(models.TextChoices):
        MC = 'mc', 'mc'  # Multiple choice
        TF = 'tf', 'tf'  # True/false
        SA = 'sa', 'sa'  # Short answer

    question_type = models.CharField(choices=QuestionTypeChoices.choices, max_length=255)
    
    num_points = models.IntegerField()

    choices = ArrayField(
        models.CharField(max_length=255),
    )

    correct_answers = ArrayField(
        models.CharField(max_length=255),
    )
