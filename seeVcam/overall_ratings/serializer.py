from rest_framework import serializers
from .models import OverallRating


class OverallRatingSerializer(serializers.ModelSerializer):
    question = serializers.RelatedField(many=False, read_only=True)

    class Meta:
        model = OverallRating
        fields = ('id', 'rating', 'question')
