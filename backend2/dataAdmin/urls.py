from django.urls import path, include
# from django.conf.urls import url

from . import views, views_api
app_name='dataAdmin'


urlpatterns=[
    path('',views.index,name='index'),
    path('login/',views.DataAdminLoginView.as_view(),name='login'),
    path('logout/',views.logout_dataAdmin,name='logout'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('create',views.createDataset),
    path('models/', views.manage_models, name='manage-models'),
    path('models/<int:pk>', views.manage_specific_model, name='manage-specific-model'),
    path('datasets/', views.manage_datasets, name='manage-datasets'),
    path('datasets/<int:pk>', views.manage_specific_dataset, name='manage-specific-dataset'),
    path('mlflow_ui', views.viewMlFLowUI, name='mlflow-ui'),
    # path('browsing/', include('filer.urls')),
    path('updateDataset/<str:dataset_id>', views.update_dataset),
]