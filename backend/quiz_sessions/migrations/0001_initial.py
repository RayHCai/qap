# Generated by Django 4.0.4 on 2023-04-05 15:03

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('quizzes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuizSessions',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('code', models.CharField(max_length=255)),
                ('active', models.BooleanField(default=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('users_in_session', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), size=None)),
                ('session_for', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='quizzes.quizzes')),
            ],
        ),
    ]