import json
from datetime import datetime
import pytz
import os
import urllib
import mlflow

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

from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.http import JsonResponse



from aiMathpad.models import ImageData, ExpressionType
from .models import Dataset, DlModel, DlModelDataset
from .serializers import DatasetSerializer, DlModelSerializer, DlModelDatasetSerializer
from .dlUtils import create_dataset

def get_mlflow_tracking_uri():
    path_to_mlruns = 'mlruns'
    abs_path_to_mlruns = os.path.abspath(path_to_mlruns)
    url_encoded_path_mlruns = urllib.parse.quote(abs_path_to_mlruns.replace("\\", "/"), safe=':/')
    mlflow_tracking_uri = f'file:///{url_encoded_path_mlruns}'

    return mlflow_tracking_uri

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

import zlib
import base64

def decode_base64_and_inflate( b64string ):
    # decoded_data = base64.b64decode( b64string )
    # print(decoded_data)
    return zlib.decompress( b64string , 15)

def deflate_and_base64_encode( string_val ):
    zlibbed_str = zlib.compress( string_val )
    compressed_string = zlibbed_str[2:-4]
    return base64.b64encode( compressed_string )

@IsDataAdmin
def viewMlFLowUI(request):
    return render(request, 'dataAdmin/mlflow_ui.html', context={})


@api_view(['GET','POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@IsDataAdmin
@IsDataAdmin
def manage_specific_dataset(request,pk):

    dataset = Dataset.objects.get(pk=pk)


    return render(request, 'dataAdmin/specific_dataset.html', context={
        'dataset':DatasetSerializer(dataset).data
    })
    # return render(request, 'dataAdmin/manage_models.html', context=context)

@api_view(['GET','POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@IsDataAdmin
@IsDataAdmin
def manage_specific_model(request,pk):
    if request.method=='POST':
        print(request.POST)
        
        if 'action' in request.POST:
            if request.POST['action'] == "Train":
                print("Training model...")
                model_pk, model_dataset_pk = request.POST['model_id'], request.POST['model_dataset_id']
                model = DlModel.objects.get(pk=model_pk)
                model_dataset = DlModelDataset.objects.get(pk=model_dataset_pk)

                model_dataset_path = os.path.abspath(model_dataset.path)
                model_repo_path = os.path.abspath(model.repo_path)


                info = execute_dynamic_file_function(os.path.join(model_repo_path, 'myTrain.py'),
                                                        'perf_train',os.path.abspath(model.path),
                                                        model_dataset_path,get_mlflow_tracking_uri(),model.mlflow_experiment_id
                                                     )

            else:
                model_pk, dataset_pk, action = request.POST['model'], request.POST['dataset_pk'], request.POST['action']
                print(type(model_pk), model_pk, dataset_pk, action)
                dataset = Dataset.objects.get(pk=dataset_pk)
                model = DlModel.objects.get(pk=model_pk)

                model_dataset_dir_name = dataset.name+f'_{dataset.id}' +' __ '+model.name+f'_{model.id}'
                model_dataset_path = os.path.join(model.path, model_dataset_dir_name)
                errorFlag = create_dataset( os.path.join(settings.BASE_DIR,dataset.path), os.path.join(settings.BASE_DIR,model.repo_path), 
                                            os.path.join(settings.BASE_DIR,model_dataset_path)
                                        )
                if errorFlag == 1:
                    print("returning error...")
                    return HttpResponse('Error in creating dataset.',status=500)

                model_dataset_name = dataset.name +' __ '+model.name
                model_dataset = None
                if model.dlmodeldatasets.filter(name=model_dataset_name,parent_dataset=dataset,dl_model=model).exists():
                    model_dataset = model.dlmodeldatasets.get(name=model_dataset_name,parent_dataset=dataset,dl_model=model)
                    model_dataset.modifier = request.user
                    model_dataset.save()
                    print(f'Dataset {model_dataset.name} modified successfully at {model_dataset.path}')
                else:
                    model_dataset = model.dlmodeldatasets.create(
                        name= model_dataset_name,
                        parent_dataset=dataset,dl_model=model, 
                        path=model_dataset_path, 
                        creator=request.user, modifier=request.user
                    )
                    print(f'Dataset {model_dataset.name} created successfully at {model_dataset.path}')
        

    order_by = request.query_params.get('order_by', 'id')
    page_number = request.query_params.get('page', 1)

    paginator = PageNumberPagination()
    paginator.page_size = 10  # Number of objects per page
    
    dlModel = DlModel.objects.get(pk=pk)
    queryset = dlModel.dlmodeldatasets.order_by(order_by)
    result_page = paginator.paginate_queryset(queryset, request)

    serializer = DlModelDatasetSerializer(result_page, many=True)
    serialized_data = serializer.data

    return render(request, 'dataAdmin/specific_model.html', context={
        'model':DlModelSerializer(dlModel).data,
        'model_datasets_list': serialized_data,
        'current_page': paginator.page.number,
        'total_pages': paginator.page.paginator.num_pages
    })
    # return render(request, 'dataAdmin/manage_models.html', context=context)

import os, sys
#execute a function from another file dynamically, with its own location as its cwd
def execute_dynamic_file_function(file_path, function_name, *args, **kwargs):
    # Get the directory of the dynamic file
    file_dir = os.path.dirname(os.path.abspath(file_path))

    # Store the current working directory and sys.path
    original_cwd = os.getcwd()
    original_sys_path = sys.path[:]

    ret_value=None
    print("flag ====", original_cwd)

    ret_val = None

    try:
        # Change the current working directory to the file's directory
        os.chdir(file_dir)

        # Append the file's directory to sys.path so that imports work correctly
        sys.path.append(file_dir)

        print("Importing module", file_path)
        # Import the module dynamically
        module = __import__(os.path.basename(file_path).replace('.py', ''))
        print("Executing the function", function_name)
        # Get the function from the module and execute it
        function = getattr(module, function_name)
        ret_val = function(*args, **kwargs)
    except Exception as e:
        print("Error", e)
    finally:
        # Revert the changes to CWD and sys.path
        os.chdir(original_cwd)
        sys.path = original_sys_path

    return ret_val
    

@api_view(['GET','POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@IsDataAdmin
@IsDataAdmin
def manage_models(request):    
    if request.method == 'POST' :
        try:
            print(request.FILES['model_repo'])
        except KeyError:
            print('No file uploaded yet', request.FILES)
        else:
            # compressed_files = request.FILES.getlist('model_repo')  # Assuming the file input field name is 'compressed_files'
            compressed_files = request.FILES['model_repo']
            # print('***',compressed_files, request.FILES)

            compressed_files = json.loads(decode_base64_and_inflate(compressed_files.read()))

            # print('compressed files again',compressed_files[0])
            output_directory = 'modelsManage'  # Specify the desired output directory

            # Create the output directory if it doesn't exist
            # os.makedirs(output_directory, exist_ok=True)

            root_dir_name=compressed_files[0]['name'].split('/')[0]

            model_root_path = os.path.join(output_directory,root_dir_name+'_root')

            if os.path.exists(model_root_path):
                if DlModel.objects.filter(name=root_dir_name).exists():
                    print(f'Model {root_dir_name} already exists. Please choose a different name.')
                    return HttpResponse(f'Model {root_dir_name} already exists. Please choose a different name for the repo.',status=500)
            
            for compressed_file in compressed_files:
                # Get the full path of the file
                full_path = os.path.join(model_root_path, compressed_file['name'])
                print(full_path,f'size:{compressed_file["size"]}', end=" ") 
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                
                # Decompress the file and write it to the output path
                with open(full_path, 'wb') as output_file:
                    print('decoding...', end="")
                    decompressed_data = decode_base64_and_inflate(bytes(compressed_file['data']))
                    print('-> done')
                    # decompressed_data = decompressor.decompress(compressed_file.read())
                    output_file.write(decompressed_data)
            
            print('Files decompressed successfully')

            # Set the repository path where artifacts will be stored
            artifact_path = os.path.join(model_root_path, 'artifacts')

            # Create the experiment
            experiment_id = mlflow.create_experiment(f"{root_dir_name}", artifact_location=artifact_path)
            print(f"Mlflow Experiment created with ID #{experiment_id}")

            model_params = {
                'name':root_dir_name,
                'path':model_root_path,
                'repo_path':os.path.join(model_root_path,root_dir_name),
                'mlflow_experiment_id':experiment_id,
                'creator':request.user,
                'modifier':request.user,
            }
            # print('saving model info to dataset...')
            dl_model = DlModel.objects.create(**model_params)
            print('model info saved to dataset successfully.')
            
            mlflow_tracking_uri = get_mlflow_tracking_uri()
            execute_dynamic_file_function(os.path.join(dl_model.path,dl_model.name,'mlflow_log_model.py'), 
                                                    'log_pretrained', os.path.abspath(dl_model.path),
                                                    mlflow_tracking_uri, 
                                                    dl_model.mlflow_experiment_id,
                                                )
            # return HttpResponse('Model saved and MlFlow experiment created.', status=200)

    order_by = request.query_params.get('order_by', 'id')
    page_number = request.query_params.get('page', 1)

    paginator = PageNumberPagination()
    paginator.page_size = 10  # Number of objects per page

    queryset = DlModel.objects.order_by(order_by)
    result_page = paginator.paginate_queryset(queryset, request)

    serializer = DlModelSerializer(result_page, many=True)
    serialized_data = serializer.data


    return render(request, 'dataAdmin/manage_models.html', context={
        'models_list': serialized_data,
        'current_page': paginator.page.number,
        'total_pages': paginator.page.paginator.num_pages
    })
    # return render(request, 'dataAdmin/manage_models.html', context=context)

@IsDataAdmin
def update_dataset(request, dataset_id):
    new_desc = request.data['dataset_desc']

    try:
        dataset_data = Dataset.objects.get(id=dataset_id)
        dataset_data.description = new_desc
        dataset_data.save()
        return JsonResponse({'message': 'Backend: Dataset Description updated successfully.'})
    except Dataset.DoesNotExist:
        return JsonResponse({'error': 'Backend: Dataset with the provided ID does not exist.'}, status=404)



@api_view(['GET','POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@IsDataAdmin
def manage_datasets(request):
    # print('manage dataset',request.user)
    order_by = request.query_params.get('order_by', 'id')
    page_number = request.query_params.get('page', 1)

    paginator = PageNumberPagination()
    paginator.page_size = 10  # Number of objects per page

    queryset = Dataset.objects.order_by(order_by)
    result_page = paginator.paginate_queryset(queryset, request)

    serializer = DatasetSerializer(result_page, many=True)
    serialized_data = serializer.data


    return render(request, 'dataAdmin/manage_datasets.html', context={
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
    # print('dashboard',request.user)
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

