# Generated by Django 4.1.7 on 2023-04-20 15:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz_sessions', '0001_initial'),
        ('answers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='answers',
            name='session_for',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='quiz_sessions.quizsessions'),
            preserve_default=False,
        ),
    ]
