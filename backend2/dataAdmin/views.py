import json
from datetime import datetime
import pytz


from django.shortcuts import render,HttpResponse, redirect
from django.urls import reverse
from allauth.account.views import LoginView
from allauth.account.models import EmailAddress
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import logout
from django.db.models import Q
from django.db.models.functions import TruncDate
from django.db.models import Func

from aiMathpad.models import ImageData, ExpressionType

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
                qFilter = {'exp_type__'+str(exp):include_flag}
                query2 = query2 | Q(**qFilter)

        dateRange = request.POST.get('dateRange')
        try:
            start, end, tz_info = json.loads(dateRange)
        except TypeError:
            start, end, tz_info = None, None, None
        else:
            print(start,end)
            pass
        
        query3 = Q(id__lt=0) if start or end else Q()
        if start:
            start= datetime.strptime(start, "%Y-%m-%dT%H:%M:%S.%fZ")
            query3 = query3 | Q(uploaded_at__gte=start)
        if end:
            end= datetime.strptime(end, "%Y-%m-%dT%H:%M:%S.%fZ")
            query3 = query3 & Q(uploaded_at__lte=end)        
        
        print(regionInputs,regionInputsUse,expressionType,expressionFilterUse,start,end, tz_info)

        query = query1 & query2 & query3
        filtered_imgData = ImageData.objects.filter(query)

        print('filtered_imgData',filtered_imgData,filtered_imgData.count())

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
        if expressionType!=None:
            expression_chars = [field.name for field in ExpressionType._meta.get_fields()][2:]
            expression_chars1 = [Exchar for Exchar in expression_chars if ((Exchar in expressionType)==include_flag and Exchar in expression_chars)]
            # print(include_flag,expression_chars1)
            simple_exp_type = {'exp_type__'+Exchar:False for Exchar in expression_chars}
            expression_stat['simple'] = filtered_imgData.filter(**simple_exp_type).count()
            for i in range(len(expression_chars1)):
                if expression_chars1[i] not in expression_stat:
                    expression_stat[expression_chars1[i]] = dict()

                exp_type = simple_exp_type.copy()
                exp_type['exp_type__'+expression_chars1[i]] = True
                expression_stat[expression_chars1[i]]['only'] = filtered_imgData.filter(**exp_type).count()
                for j in range(len(expression_chars)):
                    if expression_chars1[i]==expression_chars[j]:
                        continue
                    # print(expression_chars1[i],expression_chars[j])
                    if expression_chars[j] in expression_stat:
                        expression_stat[expression_chars1[i]][expression_chars[j]] = expression_stat[expression_chars[j]][expression_chars1[i]] 
                        continue
                    exp_type=dict()
                    exp_type['exp_type__'+expression_chars1[i]] = True
                    exp_type['exp_type__'+expression_chars[j]] = True
                    expression_stat[expression_chars1[i]][expression_chars[j]] = filtered_imgData.filter(**exp_type).count()
            
            context.update({'expression_stat':expression_stat})
        # print('expression_stat : ',expression_stat)

        # print([(date,date.isoformat()) for date in filtered_imgData.values_list('uploaded_at', flat=True).distinct()])

        target_timezone = pytz.timezone(tz_info)
        filtered_imgData = filtered_imgData.annotate(uploaded_at_date=TruncDate('uploaded_at', tzinfo=target_timezone))

        print(filtered_imgData.values_list('uploaded_at_date', flat=True).distinct(),flush=True)
        dateRange_stat = {
            date.isoformat():filtered_imgData.filter(uploaded_at_date=date).count() 
                for date in filtered_imgData.values_list('uploaded_at_date', flat=True).distinct()
            }
        context.update({'dateRange_stat':dateRange_stat})
        print('dateRange_stat : ',dateRange_stat)

    
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

