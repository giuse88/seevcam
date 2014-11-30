from rest_framework import serializers
from file_upload.serializers import UploadedFileSerializer
from interviews.models import Candidate, JobPosition, Interview


class CandidateSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(many=False)
    created_by = serializers.PrimaryKeyRelatedField(many=False)
    cv = serializers.SlugRelatedField(many=False, slug_field='id')

    class Meta:
        model = Candidate
        fields = ('id', 'name', 'email', 'surname', 'cv')


class JobPositionSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(many=False)
    created_by = serializers.PrimaryKeyRelatedField(many=False)

    class Meta:
        model = JobPosition
        fields = ('id', 'position',)


class InterviewSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer(many=False)
    job_position = JobPositionSerializer(many=False)
    catalogue = serializers.PrimaryKeyRelatedField(many=False)

    class Meta:
        model = Interview
        fields = ('id', 'start', 'end', 'status', 'job_position', 'candidate', 'catalogue')
