

from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination

from .serializers import DatasetSerializer, DlModelSerializer
from .models import Dataset, DlModel
from .views import IsDataAdmin

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


class DlModelsView(ListAPIView):
    serializer_class = DlModelSerializer
    queryset = DlModel.objects.all()
    pagination_class = PageNumberPagination  # Enable pagination

    def get_queryset(self):
        # Apply sorting based on query parameters
        queryset = super().get_queryset()
        sort_by = self.request.query_params.get('sort_by')
        if sort_by:
            queryset = queryset.order_by(sort_by)
        return queryset    

@IsDataAdmin
def viewDlModels(request):
    return DlModelsView.as_view()(request)