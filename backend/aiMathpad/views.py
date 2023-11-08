from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.http import JsonResponse
from django.conf import settings


import base64
from django.core.files.base import ContentFile
import uuid

from django.contrib.gis.geoip2 import GeoIP2
from geoip2 import errors as geoip2_errors

from .models import ImageData, ExpressionType
from .image_util import img_from_base64
from .serializers import ImageDataSerializer


# Create your views here.
@api_view(['GET'])
def know_cur_user(request):
    # checking for the parameters from the URL
    print(request.user)
    print(request.headers['Authorization'])
    if request.user.is_authenticated:
        user_info = {
            'username':request.user.username,
            'email':request.user.username
        }
        # serializer = UserSerializer(request.user)
        return Response(user_info)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
from .image_util import make_prediction

@api_view(['POST'])
def proc_image(request):
    img_64 = request.data['img_file']
    rec_exp = make_prediction(img_64)

    # print("-->",rec_exp)
    return Response({"latex_exp": rec_exp})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def store_annot(request):
    img_64 = request.data['img_file']
    image_data = img_from_base64(img_64)
    content_file = ContentFile(image_data, name='hero.jpg')

    cor_exp = request.data['correct_exp']
    rec_exp = make_prediction(img_64)

    g = GeoIP2(country='dbip-country-lite-2023-06.mmdb', city='dbip-city-lite-2023-06.mmdb')

    try:
        city, country = '', ''
        if settings.DEBUG:
            print('current address',request.META['REMOTE_ADDR'])
            user_location = g.city('103.163.182.141')
            # print(user_location)
        else:
            user_location = g.city(request.META['REMOTE_ADDR'])

        city, country = user_location['city'], user_location['country_name']
    except geoip2_errors.AddressNotFoundError as e:
        print('Ip address info not found in the database')
        city,country = '',''

    image_data = ImageData(image_file=content_file, image_label=cor_exp, creator=request.user, city=city, country=country, exp_type=ExpressionType.ExpType(cor_exp) )
    image_data.save()

    # print(cor_exp, rec_exp,request.user)

    # print(ImageData.objects.all()[0].image_file.path)


    return Response("Received")

def index(request):
    return render(request, 'aiMathpad/index.html')

# to view all the annotated data so far
class ImageDataListView(generics.ListAPIView):
    queryset = ImageData.objects.all()
    serializer_class = ImageDataSerializer

# to update the annotated data from the view page
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_image_label(request, image_id):
    new_label = request.data['image_label']

    try:
        image_data = ImageData.objects.get(id=image_id)
        image_data.image_label = new_label
        image_data.save()
        return JsonResponse({'message': 'Image label updated successfully.'})
    except ImageData.DoesNotExist:
        return JsonResponse({'error': 'Image with the provided ID does not exist.'}, status=404)
    

# to update the annotated data from the view page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_image_label(request, image_id):
    try:
        image_data = ImageData.objects.get(id=image_id)
        get_image_label = {
            'image_label': image_data.image_label
            }
        return JsonResponse(get_image_label)
    except ImageData.DoesNotExist:
        return JsonResponse({'error': 'Image with the provided ID does not exist.'}, status=404)


