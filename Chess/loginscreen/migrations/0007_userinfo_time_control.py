# Generated by Django 5.1 on 2024-09-09 11:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loginscreen', '0006_alter_gameinfo_gameid'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinfo',
            name='time_control',
            field=models.CharField(default='null'),
        ),
    ]
