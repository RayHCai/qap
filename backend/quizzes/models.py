import uuid

from django.db import models

from users.models import Users

class Quizzes(models.Model):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        blank=False,
        default=uuid.uuid4,
        editable=False
    )

    name = models.CharField(max_length=255)
    teacher = models.ForeignKey(Users, on_delete=models.CASCADE)
