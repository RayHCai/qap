# Generated by Django 4.0.4 on 2023-04-13 19:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0002_questions_question_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='questions',
            name='num_points',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
