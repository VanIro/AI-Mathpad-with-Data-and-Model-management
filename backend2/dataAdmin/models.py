from django.db import models
from django.conf import settings

# Create your models here.

class Dataset(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='datasets', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modifier = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='Mdatasets', on_delete=models.CASCADE, null=False)
    modified_at = models.DateTimeField(auto_now=True)
    path = models.CharField(max_length=250)
    num_images = models.IntegerField(default=0)

    pickled_stats = models.BinaryField(blank=True, null=True)
    # img_country_region = models.ImageField(upload_to='images/dataset/img_country_region', blank=True, null=True)
    # img_exp_types = models.ImageField(upload_to='images/dataset/img_exp_types', blank=True, null=True)
    # img_date_range = models.ImageField(upload_to='images/dataset/img_date_range', blank=True, null=True)
    
    def __str__(self):
        return self.name
    
