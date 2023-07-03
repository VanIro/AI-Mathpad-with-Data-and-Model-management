# Generated by Django 4.2.2 on 2023-07-03 02:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dataAdmin', '0002_rename_updated_at_datasets_modified_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datasets',
            name='modifier',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Mdatasets', to=settings.AUTH_USER_MODEL),
        ),
    ]