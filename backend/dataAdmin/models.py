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
        return self.name+f'({self.id})'
    
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

    def __str__(self):
        return self.name+f'({self.id})'

class DlModelDataset(models.Model):
    name = models.CharField(max_length=150, null=False)
    description = models.TextField(null=True, blank=True)
    path = models.CharField(max_length=250, null=False)

    parent_dataset = models.ForeignKey(Dataset, related_name='dlmodeldatasets', on_delete=models.CASCADE, null=False)
    dl_model = models.ForeignKey(DlModel, related_name='dlmodeldatasets', on_delete=models.CASCADE, null=False)


    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='dlmodeldatasets', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modifier = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='m_dlmodeldatasets', on_delete=models.CASCADE, null=False)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name+f'({self.id})'

    
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

    def __str__(self):
        return self.name+f'({self.id})'



from django.db.models.signals import pre_delete, post_delete
from django.db.models import ProtectedError
from django.dispatch import receiver
import mlflow
import os, shutil

@receiver(pre_delete, sender=DlModel)
def delete_model(sender, instance, **kwargs):
    # mlflow.set_tracking_uri(settings.MLFLOW_TRACKING_URI)
    
    mlflow.set_experiment('Default')
    # mlflow.delete_registered_model(instance.name)
    try:
        mlflow.delete_experiment(instance.mlflow_experiment_id)
        print('removing',(settings.BASE_DIR/f'mlruns/.trash/{instance.mlflow_experiment_id}'))
        shutil.rmtree(settings.BASE_DIR/f'mlruns/.trash/{instance.mlflow_experiment_id}')
        print(f'Experiment {instance.name}:{instance.mlflow_experiment_id} deleted.')
    except Exception as e:
        print(e)
    # raise ProtectedError(
    #         "Deletion of this instance is not allowed.",
    #         instance=instance,
    #         model=sender
    #     )
    # mlflow.delete

@receiver(post_delete, sender=DlModel)
def delete_model(sender, instance, **kwargs):
    # mlflow.set_tracking_uri(settings.MLFLOW_TRACKING_URI)
    
    root_path = instance.path
    print('removing',root_path,end=' ')
    try:
        shutil.rmtree(root_path)
        print('<-','Done')
    except Exception as e:
        print('<-','Failed',e)


    


    
