# Generated by Django 4.0.4 on 2023-03-04 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='choices',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
