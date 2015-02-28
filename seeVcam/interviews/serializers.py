import datetime
from rest_framework import serializers
from django.conf import settings
from common.helpers.timezone import now_timezone

from interviews.models import Candidate, JobPosition, Interview


class CandidateSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(many=False)
    created_by = serializers.PrimaryKeyRelatedField(many=False)
    cv = serializers.PrimaryKeyRelatedField(many=False)

    # TO DO ADD STATUS

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
        if not self.partial:
            self.is_end_before_start(attrs['start'], attrs['end'], "End must be after than start.")
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

    # TODO turn on the book validation
    # def _is_already_booked(self, interview_datetime, interview_datetime_end):
    #     interview_end_datetime = interview_datetime_end
    #     interview = Interview.objects.filter(
    #         Q(interview_datetime__range=(interview_datetime,interview_end_datetime)) |
    #         Q(interview_datetime_end__range=(interview_datetime,interview_end_datetime)) |
    #         (Q(interview_datetime__lte=interview_datetime) & Q(interview_datetime_end__gte=interview_end_datetime)),
    #         interview_owner=self.user.id).first()
    #     #TODO this should be handle in the above query
    #     if interview is not None and self.instance.id is not interview.id:
    #         self._add_error_to_form('interview_datetime',
    #                                 'Another interview has already been scheduled for the date selected.')
    #     return

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
        fields = ('id', 'start', 'end', 'status',  'job_position', 'candidate', 'catalogue', 'job_position_name',
                  'overall_score')
