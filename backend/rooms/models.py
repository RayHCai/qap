import uuid
from django.db import models

from users.models import Users

class Rooms(models.Model):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        blank=False,
        default=uuid.uuid4,
        editable=False
    )
        
    owner = models.ForeignKey(Users, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} - created at {self.created_at} owned by {self.owner}'
