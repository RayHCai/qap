import uuid

from django.db import models

class Classes(models.Model):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        blank=False,
        default=uuid.uuid4,
        editable=False
    )

    code = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
