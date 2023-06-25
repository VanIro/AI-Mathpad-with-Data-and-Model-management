from django.urls import path, include

from . import views

app_name='dataAdmin'

urlpatterns=[
    path('',views.index,name='index'),
    path('login/',views.DataAdminLoginView.as_view(),name='login'),
    path('logout/',views.logout_dataAdmin,name='logout'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
]