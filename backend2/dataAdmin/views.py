import json
from datetime import datetime
import pytz

from django.conf import settings
from django.shortcuts import render,HttpResponse, redirect
from django.urls import reverse
from allauth.account.views import LoginView
from allauth.account.models import EmailAddress
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import logout
from django.db.models import Q
from django.db.models.functions import TruncDate
from django.db.models import Func, Count

from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view


from aiMathpad.models import ImageData, ExpressionType
from .models import Dataset
from .serializers import DatasetSerializer

def IsDataAdmin(view_func):
    def wrapper(request,*args,**kwargs):
        if request.user.is_authenticated and request.user.groups.filter(name='DataAdmin').exists():
            return view_func(request, *args, **kwargs)
        else:
            return redirect(reverse('dataAdmin:login'))
    
    return wrapper

# Create your views here.
@IsDataAdmin
def index(request):
    return redirect(reverse('dataAdmin:dashboard'))

@IsDataAdmin
def manage_models(request):
    context = dict()
    return render(request, 'dataAdmin/manage_models.html', context=context)

class DatasetView(ListAPIView):
    serializer_class = DatasetSerializer
    queryset = Dataset.objects.all()
    pagination_class = PageNumberPagination  # Enable pagination

    def get_queryset(self):
        # Apply sorting based on query parameters
        queryset = super().get_queryset()
        sort_by = self.request.query_params.get('sort_by')
        if sort_by:
            queryset = queryset.order_by(sort_by)
        return queryset
    

@IsDataAdmin
def viewDataset(request):
    return DatasetView.as_view()(request)

@IsDataAdmin
@api_view(['GET'])
def manage_datasets(request):
    order_by = request.query_params.get('order_by', 'id')
    page_number = request.query_params.get('page', 1)

    paginator = PageNumberPagination()
    paginator.page_size = 10  # Number of objects per page

    queryset = Dataset.objects.order_by(order_by)
    result_page = paginator.paginate_queryset(queryset, request)

    serializer = DatasetSerializer(result_page, many=True)
    serialized_data = serializer.data

    return render(request, 'dataAdmin/manage_datasets.html', {
        'datasets_list': serialized_data,
        'current_page': paginator.page.number,
        'total_pages': paginator.page.paginator.num_pages
    })
    # return render(request, 'dataAdmin/manage_datasets.html', context=context)

def get_images():
    pass

@IsDataAdmin
def dashboard_view(request):
    context=dict()
    if request.method=='POST':
        query1 = Q()
        regionInputs = None
        regionInputsUse = None
        try:
            countryRegionWidData = json.loads(request.POST.get('countryRegionWidget'))
        except TypeError:
            countryRegionWidData = None
        else:
            query1 = query1&Q(id__lt=0)
            regionInputs = countryRegionWidData['regionInputs']
            regionInputsUse = countryRegionWidData['regionInputsUse']

            for country in regionInputs:
                for city in regionInputs[country]:
                    query1 = query1 | Q(country=country, city=city)
            if regionInputsUse=='exclude':
                query1 = ~query1
            

        query2=Q()
        expressionType = None
        expressionFilterUse = None
        try:
            expressionWidData = json.loads(request.POST.get('expressionTypeWidget'))
        except TypeError:
            expressionWidData = None
        else:
            # global expressionType, expressionFilterUse
            expressionType = expressionWidData['expressionTypeChoices']
            expressionFilterUse = expressionWidData['expressionTypeUse']

            include_flag = expressionFilterUse=='include'
            for exp in expressionType:
                qFilter = {}
                if exp=='Simple':
                    for exp2 in [field.name for field in ExpressionType._meta.get_fields()][2:]:
                        qFilter .update({'exp_type__'+str(exp2):False}) 
                else:
                    qFilter.update( {'exp_type__'+str(exp):True})
                query2 = query2 | Q(**qFilter)
            
            if not include_flag:
                query2 = ~query2

        dateRange = request.POST.get('dateRange')
        try:
            start, end, tz_info = json.loads(dateRange)
        except TypeError:
            start, end, tz_info = None, None, None
        else:
            print(start,end)
            pass

        tz_info = json.loads(request.POST.get('tz_info'))
        # print('tz_info',tz_info)
        
        query3 = Q(id__lt=0) if (start or end) else Q()
        if start:
            start= datetime.strptime(start, "%Y-%m-%dT%H:%M:%S.%fZ")
            query3 = query3 | Q(uploaded_at__gte=start)
        if end:
            end= datetime.strptime(end, "%Y-%m-%dT%H:%M:%S.%fZ")
            if start:
                print("not here")
                query3 = query3 & Q(uploaded_at__lte=end)
            else:
                print('here')
                query3 = query3 | Q(uploaded_at__lte=end)     
        
        print(regionInputs,regionInputsUse,expressionType,expressionFilterUse,start,end, tz_info)

        query = query1 & query2 & query3
        filtered_imgData = ImageData.objects.filter(query)

        # print('filtered_imgData',filtered_imgData,filtered_imgData.count())
        print('filtered_imgData',filtered_imgData.count())
            

        country_region_stat = {
                cntry:{ 
                    city:filtered_imgData.filter(country=cntry,city=city).count() 
                    for city in filtered_imgData.filter(country=cntry).values_list('city', flat=True).distinct() if not city==''
                } 
                for cntry in filtered_imgData.values_list('country', flat=True).distinct() if not cntry==''
            }
        
        context.update({'country_region_stat':country_region_stat})
        # print('country_region_stat : ',country_region_stat)

        expression_stat = dict()
        if True:
            expression_chars =  [field.name for field in ExpressionType._meta.get_fields()][2:]
            ex_chars = ['exp_type__'+Exchar for Exchar in expression_chars]
            expression_chars = [Exchar for Exchar in expression_chars if filtered_imgData.filter(**{'exp_type__'+Exchar:True}).exists()]


            exp_types_counts = filtered_imgData.values(*ex_chars).annotate(count = Count('exp_type__'+expression_chars[0]))
            # print('exp_type counts',list(exp_types_counts))
            
            if expressionType:
                expression_chars1 = [Exchar for Exchar in expression_chars 
                                        if ((Exchar in expressionType)==include_flag and Exchar in expression_chars)
                                     ]
            else:
                expression_chars1 = expression_chars
            # print(include_flag,expression_chars1)
            simple_exp_type = {'exp_type__'+Exchar:False for Exchar in expression_chars}
            expression_stat['simple'] = exp_types_counts.get(**simple_exp_type)['count']#filtered_imgData.filter(**simple_exp_type).count()


            for i in range(len(expression_chars1)):
                expression_stat[expression_chars1[i]] =  dict(
                                    map(lambda item: (f"{[key.replace('exp_type__','') for key in item if key!='count' and item[key]==True]}",item['count']),
                                         exp_types_counts.filter(**{'exp_type__'+expression_chars1[i]:True})\
                                            .values(*['exp_type__'+a for a in expression_chars if a != expression_chars1[i]],'count')
                                    ))
                try:
                    expression_stat[expression_chars1[i]]['only'] = expression_stat[expression_chars1[i]].pop( '[]' )
                except KeyError:
                    pass
                print('filtered_ex_counts',list(expression_stat[expression_chars1[i]]))
                
            
            context.update({'expression_stat':expression_stat})
        # print('expression_stat : ',expression_stat)

        # print([(date,date.isoformat()) for date in filtered_imgData.values_list('uploaded_at', flat=True).distinct()])

        target_timezone = pytz.timezone(tz_info) if tz_info else pytz.timezone(settings.TIME_ZONE)
        filtered_imgData = filtered_imgData.annotate(uploaded_at_date=TruncDate('uploaded_at', tzinfo=target_timezone))

        # print(filtered_imgData.values_list('uploaded_at_date', flat=True).distinct(),flush=True)
        dateRange_stat = {
            date.isoformat():filtered_imgData.filter(uploaded_at_date=date).count() 
                for date in filtered_imgData.values_list('uploaded_at_date', flat=True).distinct()
            }
        context.update({'dateRange_stat':dateRange_stat})
        # print('dateRange_stat : ',dateRange_stat)

        
        #create dataset
        try:
            createD = json.loads(request.POST.get('createDataset'))
        except TypeError:
            createD = None
        else:
            createDataset(filtered_imgData,createD, request.user, country_region_stat, expression_stat, dateRange_stat)

        server_tz = pytz.timezone(settings.TIME_ZONE)
        client_tz = pytz.timezone(tz_info) 

        if start:
            start2 = server_tz.localize(start)
            start2 = start2.astimezone(client_tz).isoformat()
            # print(start2)
        else: start2=None

        if end:
            end2 = server_tz.localize(end)
            end2 = end2.astimezone(client_tz).isoformat()
            # print(end2)
        else: end2=None
        # print(start2, end2)
        context.update({
            'countryRegionWidData':countryRegionWidData,
            'expressionWidData':expressionWidData,
            'dateRange':[start2,end2] if dateRange else None,
        })

    
    countries = ImageData.objects.values_list('country', flat=True).distinct()
    country_region_data = {cntry:list(ImageData.objects.all().filter(country=cntry).values_list('city', flat=True).distinct()) for cntry in countries if not cntry==''}
    # print(country_region_data)
    expression_chars = [field.name for field in ExpressionType._meta.get_fields()][2:]
    # print(expression_chars)
    context.update({
        'country_region_data':country_region_data,
        'expression_chars':expression_chars,
    })
    return render(request,'dataAdmin/dashboard.html',context)

import os, pickle
def createDataset(filtered_imgData,createD, user, *stats):
    print('createDataset',list(createD.items()))

    pickled_stats = pickle.dumps(stats)
    values = {
        'name': createD['datasetName'],
        'description': createD['datasetDesc'],
        'creator':user,
        'modifier':user,
        'num_images':filtered_imgData.count(),
        'pickled_stats':pickled_stats,
    }

    dataset = Dataset(**values)
    dataset.save()


    
    uid = dataset.pk
    # Get the current date and time
    current_datetime = datetime.now().strftime('%Y%m%d%H%M%S')

    dataset_path = 'datasets/'
    # Create a folder with the dataset name and current date
    dataset_folder = dataset_path+f"{createD['datasetName']}_{current_datetime}_{uid}"

    os.makedirs(dataset_folder)

    
    dataset.path = dataset_folder
    dataset.save()

    annotation_path = os.path.join(dataset_folder, f"annotation.txt")
    with open(annotation_path, 'w') as fa:
    # Loop through the queryset and save the images and annotations
        for index, item in enumerate(filtered_imgData):
            image_path = os.path.join(dataset_folder, f"image_{index}.jpg")

            try:
                # Save the image file
                with open(image_path, 'wb') as fi:
                    fi.write(item.image_file.read())
            except FileNotFoundError as e:
                print(e)
                continue
            else:
                # Save the annotation
                annotation = f"Image {index+1}:\n" \
                            f"Image file: {image_path}\n" \
                            f"Annotation: {item.image_label}\n\n"
                fa.write(annotation)



def logout_dataAdmin(request):
    logout(request)
    return redirect('dataAdmin:login')
class DataAdminLoginView(LoginView):
    template_name = 'dataAdmin/login.html'  # Customize this template as per your needs

    def dispatch(self, request, *args, **kwargs):
        if self.request.user.is_authenticated and not request.user.groups.filter(name='DataAdmin').exists():
            logout(request)
        return super().dispatch(request, *args, **kwargs)
    
    def form_valid(self, form):
        email = form.cleaned_data.get('login')
        user = EmailAddress.objects.get(email=email).user
        # print(user)
        # print('***********DataAdminLoginView | form_valid : ',self.request.user,self.request.user.groups)
        # Perform additional checks, such as verifying user's group membership
        if user.groups.filter(name='DataAdmin').exists():
            return super().form_valid(form)
        else:
            # Redirect to an appropriate page or display an error message
            # form.add_error(None, 'Invalid login credentials')
            return self.form_invalid(form)

