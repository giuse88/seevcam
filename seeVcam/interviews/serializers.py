import datetime
import pytz
from rest_framework import serializers
from django.conf import settings
from common.helpers.timezone import now_timezone
from common.middleware import timezone

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
    start = serializers.DateTimeField(format=settings.DATE_INPUT_FORMATS[0], input_formats=settings.DATE_INPUT_FORMATS)
    end = serializers.DateTimeField(format=settings.DATE_INPUT_FORMATS[0], input_formats=settings.DATE_INPUT_FORMATS)

    def validate(self, attrs):
        self.is_end_before_start(attrs['start'], attrs['end'], "End must be before than start.")
        return attrs

    def validate_start(self, attrs, source):
        value = attrs[source]
        self.is_time_missing(value, "Start date is missing.")
        self.is_valid_interview_datetime(value, "Invalid start date. Start date expired.")
        self.is_valid_timezone(value, "Invalid timezone.")
        return attrs

    def validate_end(self, attrs, source):
        value = attrs[source]
        self.is_time_missing(value, "End date is missing.")
        self.is_valid_interview_datetime(value, "Invalid end date. End date expired.")
        self.is_valid_timezone(value, "Invalid timezone.")
        return attrs

    @staticmethod
    def is_time_missing(interview_datetime, error_msg):
        if interview_datetime is None:
            raise serializers.ValidationError(error_msg)
        return interview_datetime

    @staticmethod
    def is_valid_timezone(interview_datetime, error_msg):
        if interview_datetime.tzinfo is None or not interview_datetime.utcoffset() == datetime.timedelta(0):
            raise serializers.ValidationError(error_msg)
        return interview_datetime

    @staticmethod
    def is_valid_interview_datetime(interview_datetime, error_msg):
        if interview_datetime is None or interview_datetime < now_timezone():
            raise serializers.ValidationError(error_msg)
        return interview_datetime

    @staticmethod
    def is_end_before_start(start, end, error_msg):
        if end <= start:
            raise serializers.ValidationError(error_msg)
        return start, end

    class Meta:
        model = Interview
        fields = ('id', 'start', 'end', 'status', 'job_position', 'candidate', 'catalogue', 'job_position_name')
