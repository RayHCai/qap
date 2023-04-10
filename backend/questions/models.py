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

    title = models.CharField(max_length=255)
    content = models.TextField()

    is_visible = models.BooleanField()

    question_for = models.ForeignKey(Quizzes, on_delete=models.CASCADE)

    choices = ArrayField(
        models.CharField(max_length=255),
    )
    select_multiple = models.BooleanField(null=True)
    
    required = models.BooleanField(default=True)
    
    correct_answer = models.TextField(null=True)
