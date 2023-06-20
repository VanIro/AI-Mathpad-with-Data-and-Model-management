from django.shortcuts import render,HttpResponse, redirect
from django.urls import reverse
from allauth.account.views import LoginView
from allauth.account.models import EmailAddress
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import logout

# Create your views here.

def index(request):
    return HttpResponse("Hello World")

def IsDataAdmin(view_func):
    def wrapper(request,*args,**kwargs):
        if request.user.is_authenticated and request.user.groups.filter(name='DataAdmin').exists():
            return view_func(request, *args, **kwargs)
        else:
            return redirect(reverse('dataAdmin:login'))
    
    return wrapper

@IsDataAdmin
def dashboard_view(request):
    return HttpResponse(request.user)



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

