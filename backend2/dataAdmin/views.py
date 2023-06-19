from django.shortcuts import render,HttpResponse
from allauth.account.views import LoginView

# Create your views here.

def index(request):
    return HttpResponse("Hello World")

def dashboard_view(request):
    return HttpResponse(request.user)



class DataAdminLoginView(LoginView):
    template_name = 'dataAdmin/login.html'  # Customize this template as per your needs

    def form_valid(self, form):
        print('\n\n***********herohreookjsflkj',self.request.user,self.request.user.groups)
        # Perform additional checks, such as verifying user's group membership
        if self.request.user.groups.filter(name='DataAdmin').exists():
            print('hey')
            return super().form_valid(form)
        else:
            print('nope')
            # Redirect to an appropriate page or display an error message
            return self.form_invalid(form)

