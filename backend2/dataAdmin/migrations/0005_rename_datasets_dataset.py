# Generated by Django 4.2.2 on 2023-07-03 03:36

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dataAdmin', '0004_alter_datasets_modifier'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Datasets',
            new_name='Dataset',
        ),
    ]
