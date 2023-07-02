from django.db import models

# Create your models here.

class Datasets(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    path = models.CharField(max_length=250)

    img_country_region = models.ImageField(upload_to='images/dataset/img_country_region', blank=True, null=True)
    img_exp_types = models.ImageField(upload_to='images/dataset/img_exp_types', blank=True, null=True)
    img_date_range = models.ImageField(upload_to='images/dataset/img_date_range', blank=True, null=True)
    
    def __str__(self):
        return self.name
