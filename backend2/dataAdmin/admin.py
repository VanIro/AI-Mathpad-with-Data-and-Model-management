from django.contrib import admin

# Register your models here.

from .models import Dataset

class DatasetsAdmin(admin.ModelAdmin):
    list_display = ('__str__','name', 'creator', 'num_images','created_at')

admin.site.register(Dataset,DatasetsAdmin)

