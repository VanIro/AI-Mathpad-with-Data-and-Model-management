from django.db import models
from django.conf import settings

# Create your models here.

class Dataset(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='datasets', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modifier = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='m_datasets', on_delete=models.CASCADE, null=False)
    modified_at = models.DateTimeField(auto_now=True)
    path = models.CharField(max_length=250)
    num_images = models.IntegerField(default=0)

    pickled_stats = models.BinaryField(blank=True, null=True)
    # img_country_region = models.ImageField(upload_to='images/dataset/img_country_region', blank=True, null=True)
    # img_exp_types = models.ImageField(upload_to='images/dataset/img_exp_types', blank=True, null=True)
    # img_date_range = models.ImageField(upload_to='images/dataset/img_date_range', blank=True, null=True)
    
    def __str__(self):
        return self.name
    
class DlModel(models.Model):
    name = models.CharField(max_length=150, null=False)
    description = models.TextField(null=True, blank=True)
    path = models.CharField(max_length=250,null=False)
    repo_path = models.CharField(max_length=250)
    mlflow_experiment_id = models.CharField(max_length=250, null=True, blank=True)

    primary_dl_model_version = models.OneToOneField('DlModelVersion', related_name='dlmodels', on_delete=models.SET_NULL, null=True, blank=True)

    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='dlmodels', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modifier = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='m_dlmodels', on_delete=models.CASCADE, null=False)
    modified_at = models.DateTimeField(auto_now=True)

class DlModelDataset(models.Model):
    name = models.CharField(max_length=150, null=False)
    description = models.TextField()
    path = models.CharField(max_length=250, null=False)

    parent_dataset = models.ForeignKey(Dataset, related_name='dlmodeldatasets', on_delete=models.CASCADE, null=False)
    dl_model = models.ForeignKey(DlModel, related_name='dlmodeldatasets', on_delete=models.CASCADE, null=False)


    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='dlmodeldatasets', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modifier = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='m_dlmodeldatasets', on_delete=models.CASCADE, null=False)
    modified_at = models.DateTimeField(auto_now=True)

    
class DlModelVersion(models.Model):
    name = models.CharField(max_length=150, null=False)
    description = models.TextField()
    path = models.CharField(max_length=250, null=False)

    dl_model_dataset = models.ForeignKey(DlModelDataset, related_name='dlmodelVersions', on_delete=models.SET_NULL, null=True, blank=True)
    dl_model = models.ForeignKey(DlModel, related_name='dlmodelVersions', on_delete=models.CASCADE, null=False)

    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='dlmodelVersions', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modifier = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='m_dlmodelVersions', on_delete=models.CASCADE, null=False)
    modified_at = models.DateTimeField(auto_now=True)




    


    
