from rest_framework import serializers

class ClassesSerializer(serializers.ModelSerializer):
    fields = [
        'name',
        'code'
    ]
