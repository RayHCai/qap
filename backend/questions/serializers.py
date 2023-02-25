from rest_framework import serializers

class QuestionsSerializer(serializers.ModelSerializer):
    fields = [
        'id',
        'title',
        'content'
    ]
