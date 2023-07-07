import pickle

from rest_framework import serializers
from .models import Dataset, DlModel

class PickledListField(serializers.Field):
    def to_representation(self, value):
        if value:
            return pickle.loads(value)
        return []

    def to_internal_value(self, data):
        return pickle.dumps(data)

class DatasetSerializer(serializers.ModelSerializer):
    creator = serializers.CharField(source='creator.username', read_only=True)
    modifier = serializers.CharField(source='modifier.username', read_only=True)
    pickled_stats = PickledListField()
    class Meta:
        model = Dataset
        fields = '__all__'

class DlModelSerializer(serializers.ModelSerializer):
    creator = serializers.CharField(source='creator.username', read_only=True)
    modifier = serializers.CharField(source='modifier.username', read_only=True)
    class Meta:
        model = DlModel
        fields = '__all__'#['__all__','creator_name','modifier_name']