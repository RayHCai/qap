import uuid

from django.db import models


class Users(models.Model):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        blank=False,
        default=uuid.uuid4,
        editable=False
    )

    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
