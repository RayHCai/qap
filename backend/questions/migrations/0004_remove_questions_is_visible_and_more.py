# Generated by Django 4.0.4 on 2023-04-13 20:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0003_questions_num_points'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questions',
            name='is_visible',
        ),
        migrations.RemoveField(
            model_name='questions',
            name='required',
        ),
        migrations.RemoveField(
            model_name='questions',
            name='select_multiple',
        ),
    ]
