import uuid

from django.db import models
from django.contrib.postgres.fields import ArrayField

from quizzes.models import Quizzes

class QuizSessions(models.Model):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        blank=False,
        default=uuid.uuid4,
        editable=False
    )

    code = models.CharField(max_length=255)
    active = models.BooleanField(default=True)

    date_created = models.DateTimeField(auto_now_add=True)

    session_for = models.ForeignKey(Quizzes, on_delete=models.CASCADE)

    users_in_session = ArrayField(
        models.CharField(max_length=255)
    )
