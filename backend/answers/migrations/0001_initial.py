# Generated by Django 4.2.4 on 2023-09-22 21:13

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('quiz_sessions', '0001_initial'),
        ('questions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answers',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('student_name', models.CharField(max_length=255)),
                ('text_answer', models.TextField(blank=True)),
                ('selected', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), size=None)),
                ('correct', models.BooleanField()),
                ('date_answered', models.DateTimeField(auto_now_add=True)),
                ('answer_for', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='questions.questions')),
                ('session_for', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='quiz_sessions.quizsessions')),
            ],
        ),
    ]
