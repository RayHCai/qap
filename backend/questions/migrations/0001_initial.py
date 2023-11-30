# Generated by Django 4.2.4 on 2023-09-22 21:13

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
            name='Questions',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('title', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('question_type', models.CharField(choices=[('mc', 'mc'), ('tf', 'tf'), ('sa', 'sa')], max_length=255)),
                ('num_points', models.IntegerField()),
                ('choices', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), size=None)),
                ('correct_answer', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), size=None)),
                ('question_for', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='quizzes.quizzes')),
            ],
        ),
    ]
