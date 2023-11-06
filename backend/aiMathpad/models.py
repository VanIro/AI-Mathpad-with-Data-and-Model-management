# from django.contrib.gis.db import models #as gis_models
from django.db import models
from django.conf import settings

# Create your models here.
image_upload_path = 'db_images/'
class ImageData(models.Model):
    image_file = models.ImageField(upload_to=image_upload_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    image_label = models.CharField(max_length=400, default='')
    # image_label = models.CharField(max_length=400, null=True, default='')
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='annoted_images', on_delete=models.CASCADE, null=False)
    city = models.CharField(max_length=100, default='')
    country = models.CharField(max_length=100, default='')
    exp_type = models.ForeignKey('ExpressionType', related_name='images', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return 'Image_'+str(self.id)
    
class ExpressionType(models.Model):
    fractions = models.BooleanField(default=False)
    exponentials = models.BooleanField(default=False)
    roots = models.BooleanField(default=False)
    summations = models.BooleanField(default=False)
    logs = models.BooleanField(default=False)
    trigonometries = models.BooleanField(default=False)
    derivatives = models.BooleanField(default=False)
    integrations = models.BooleanField(default=False)

    #make the values of all above fields be unique between rows
    class Meta:
        unique_together = ('fractions', 'exponentials', 'roots', 'summations', 'logs', 'trigonometries', 'derivatives', 'integrations')

    @classmethod
    def ExpType(cls, exp):
        exp_type = get_exp_type(exp)
        return cls.objects.all().get_or_create(fractions=exp_type.fractions, exponentials=exp_type.exponentials, roots=exp_type.roots, summations=exp_type.summations, logs=exp_type.logs, trigonometries=exp_type.trigonometries, derivatives=exp_type.derivatives, integrations=exp_type.integrations)[0]
    


    def __str__(self):
        return 'Expression Type : '+str(self.id)
    
def get_exp_type(expression):
    exp_type = ExpressionType()
    if check_fraction(expression):
        exp_type.fractions = True
    if check_exponential(expression):
        exp_type.exponentials = True
    if check_root(expression):    
        exp_type.roots = True
    if check_summation(expression):
        exp_type.summations = True
    if check_log(expression):
        exp_type.logs = True
    if check_trigonometry(expression):
        exp_type.trigonometries = True
    if check_derivative(expression):
        exp_type.derivatives = True
    if check_integration(expression):
        exp_type.integrations = True
    
    return exp_type

def check_fraction(ex):
    if '/' in ex or r'\frac' in ex:
        return True
    return False

#check for cases of r'\^'
def check_exponential(ex):
    if '^' in ex:
        return True
    return False

#r'\sqrt[q]' is qth root symbol
def check_root(ex):
    if r'\sqrt' in ex:
        return True
    return False

def check_summation(ex):
    if r'\sum' in ex:
        return True
    return False

def check_log(ex):  
    if r'\log' in ex:
        return True
    return False

def check_trigonometry(ex):
    if r'\sin' in ex or r'\cos' in ex or r'\tan' in ex:
        return True
    return False

def check_derivative(ex):
    if r'\frac{d' in ex or r'\frac{\partial' in ex:
        return True
    return False

def check_integration(ex):
    if r'\int' in ex:
        return True
    return False
