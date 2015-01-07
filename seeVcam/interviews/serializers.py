import datetime

from django.utils.encoding import force_str
from rest_framework import serializers
from django.conf import settings
import dateutil.parser

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
    start = serializers.DateTimeField(input_formats=settings.DATE_INPUT_FORMATS)
    end = serializers.DateTimeField(input_formats=settings.DATE_INPUT_FORMATS)

    class Meta:
        model = Interview
        fields = ('id', 'start', 'end', 'status', 'job_position', 'candidate', 'catalogue', 'job_position_name')

    # def validate_start(self, attrs, source):
    #     value = attrs[source]
    #     validate_datetime_format(value)
    #     return attrs
    #
    # def validate_end(self, attrs, source):
    #     value = attrs[source]
    #     validate_datetime_format(value)
    #     return attrs


def to_datetime(value):
    # return dateutil.parser.parse(force_str(value))
    return datetime.datetime.strptime(force_str(value), settings.DATE_INPUT_FORMATS[0])


def validate_datetime_format(value):
    try:
        start_datetime = to_datetime(value)
    except ValueError:
        raise serializers.ValidationError("{0} is a invalid format. {1} format supported."
                                          .format(value, settings.DATE_INPUT_FORMATS[0]))
    return start_datetime


