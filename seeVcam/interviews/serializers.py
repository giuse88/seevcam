from rest_framework import serializers
from interviews.models import Candidate, JobPosition, Interview


class CandidateSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(many=False)
    created_by = serializers.PrimaryKeyRelatedField(many=False)
    cv = serializers.PrimaryKeyRelatedField(many=False)

    class Meta:
        model = Candidate
        fields = ('id', 'name', 'email', 'surname', 'cv')


class JobPositionSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(many=False)
    created_by = serializers.PrimaryKeyRelatedField(many=False)
    job_description = serializers.PrimaryKeyRelatedField(many=False)

    class Meta:
        model = JobPosition
        fields = ('id', 'position', 'job_description')


class InterviewSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer(many=False)
    job_position = serializers.PrimaryKeyRelatedField(many=False)
    catalogue = serializers.PrimaryKeyRelatedField(many=False)
    job_position_name = serializers.Field(source="job_position_name")

    class Meta:
        model = Interview
        fields = ('id', 'start', 'end', 'status', 'job_position', 'candidate', 'catalogue', 'job_position_name')
