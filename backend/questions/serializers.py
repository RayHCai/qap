from rest_framework import serializers
from questions.models import Question

class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id',
            'title',
            'content',
            'visible',
            'choices',
        ]
