import pickle

from rest_framework import serializers
from .models import Dataset

class PickledListField(serializers.Field):
    def to_representation(self, value):
        if value:
            return pickle.loads(value)
        return []

    def to_internal_value(self, data):
        return pickle.dumps(data)

class DatasetSerializer(serializers.ModelSerializer):
    pickled_stats = PickledListField()
    class Meta:
        model = Dataset
        fields = '__all__'