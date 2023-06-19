from django.contrib import admin

# Register your models here.

from .models import ImageData, ExpressionType

class ImageDataAdmin(admin.ModelAdmin):
    list_display = ('__str__','image_label','exp_type', 'creator', 'city','uploaded_at')

admin.site.register(ImageData,ImageDataAdmin)


class ExpressionTypeAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'fractions',    'exponentials',    'roots',    'summations',    'logs',    'trigonometries',    'derivatives',    'integrations')

admin.site.register(ExpressionType,ExpressionTypeAdmin)
