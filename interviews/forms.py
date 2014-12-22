import datetime

from django.conf import settings
from django import forms
from django.core.exceptions import ValidationError
from django.db.models import Q
from common.helpers.timezone import now_timezone, to_system_timezone

from models import Interview


class CreateInterviewForm(forms.ModelForm):
    class Meta:
        model = Interview
        fields = ['candidate_name', 'candidate_surname', 'candidate_email', 'candidate_cv',
                  'interview_datetime', 'interview_datetime_end', 'interview_description', 'interview_position',
                  'interview_catalogue']

    def __init__(self, user, *args, **kwargs):
        super(CreateInterviewForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean(self):
        cleaned_data = super(CreateInterviewForm, self).clean()
        interview_datetime = cleaned_data.get('interview_datetime')
        interview_datetime_end = cleaned_data.get('interview_datetime_end')
        interview_datetime = to_system_timezone(interview_datetime, self.user)
        interview_datetime_end = to_system_timezone(interview_datetime_end, self.user)
        self._is_valid_interview_datetime(interview_datetime)
        self._is_already_booked(interview_datetime, interview_datetime_end )
        return cleaned_data

    def __clean_interview_datetime(self):
        interview_datetime = self.cleaned_data['interview_datetime']
        interview_datetime = to_system_timezone(interview_datetime, self.user)
        return interview_datetime

    def clean_candidate_cv(self):
        cv = self.cleaned_data['candidate_cv']
        is_valid_file(cv)
        return cv

    def clean_interview_job_description(self):
        job_spec = self.cleaned_data['interview_job_description']
        is_valid_file(job_spec)
        return job_spec

    def _is_already_booked(self, interview_datetime, interview_datetime_end):
        interview_end_datetime = interview_datetime_end
        interview = Interview.objects.filter(
            Q(interview_datetime__range=(interview_datetime,interview_end_datetime)) |
            Q(interview_datetime_end__range=(interview_datetime,interview_end_datetime)) |
            (Q(interview_datetime__lte=interview_datetime) & Q(interview_datetime_end__gte=interview_end_datetime)),
            interview_owner=self.user.id).first()
        #TODO this should be handle in the above query
        if interview is not None and self.instance.id is not interview.id:
            self._add_error_to_form('interview_datetime',
                                    'Another interview has already been scheduled for the date selected.')
        return

    def _is_valid_interview_datetime(self, interview_datetime):
        if interview_datetime is None or interview_datetime < now_timezone():
            self._add_error_to_form('interview_datetime', 'You cannot create a interview in the past!')
        return

    def _add_error_to_form(self, key, msg):
        if self._errors.get(key) is None:
            from django.forms.util import ErrorList
            self._errors[key] = ErrorList()
        self._errors[key].append(msg)



# #######################################################################################################################
#                                                   FUNCTION HELPERS                                                   #
########################################################################################################################


def is_valid_file(uploaded_file):

    # No ideal, try using file.
    # if not uploaded_file.content_type in settings.SEEVCAM_UPLOAD_FILE_MIME_TYPES:
    #     raise ValidationError("Please use a file with a different format.", code="invalid_file_format")

    if uploaded_file.size > settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE:
        error_msg = "Please keep filesize under %s" % settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE
        raise ValidationError(error_msg, code='file exceeds maximum size')

    return True
