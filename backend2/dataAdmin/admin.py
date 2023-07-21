from django.contrib import admin

# Register your models here.

from .models import Dataset, DlModel, DlModelDataset, DlModelVersion

class DatasetsAdmin(admin.ModelAdmin):
    list_display = ('__str__','name', 'creator', 'num_images','created_at')

admin.site.register(Dataset,DatasetsAdmin)

class DlModelAdmin(admin.ModelAdmin):
    list_display = ('name','repo_path', 'creator', 'mlflow_experiment_id','created_at')

admin.site.register(DlModel,DlModelAdmin)

class DlModelDatasetAdmin(admin.ModelAdmin):
    list_display = ('name','dl_model','parent_dataset', 'creator','created_at')

admin.site.register(DlModelDataset,DlModelDatasetAdmin)

