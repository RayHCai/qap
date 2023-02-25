import uuid

from django.db import models

from classes.models import Classes

class Question(models.Model):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        blank=False,
        default=uuid.uuid4,
        editable=False
    )

    title = models.CharField(max_length=255)
    content = models.TextField()

    c = models.ForeignKey(Classes, on_delete=models.CASCADE)
