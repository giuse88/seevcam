from django.conf import settings
from django import forms
from django.core.exceptions import ValidationError

from common.helpers.timezone import now_timezone, to_system_timezone
from models import Interview


class CreateInterviewForm(forms.ModelForm):
    class Meta:
        model = Interview
        fields = ['candidate_name', 'candidate_surname', 'candidate_email', 'candidate_cv',
                  'interview_datetime', 'interview_description', 'interview_position',
                  'interview_catalogue', 'interview_job_description', 'interview_duration']

    def __init__(self, user, *args, **kwargs):
        super(CreateInterviewForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean_interview_datetime(self):
        interview_datetime = self.cleaned_data['interview_datetime']
        interview_datetime = to_system_timezone(interview_datetime, self.user)
        self._is_valid_interview_datetime(interview_datetime)
        self._is_already_booked(interview_datetime)
        return interview_datetime

    def clean_candidate_cv(self):
        cv = self.cleaned_data['candidate_cv']
        is_valid_file(cv)
        return cv

    def clean_interview_job_description(self):
        job_spec = self.cleaned_data['interview_job_description']
        is_valid_file(job_spec)
        return job_spec

    def _is_already_booked(self, interview_datetime):
        interview = Interview.objects.filter(interview_datetime=interview_datetime,
                                             interview_owner=self.user.id)
        if interview.exists():
            raise ValidationError('Another interview has already been scheduled for the date selected.',
                                  code='already_scheduled_interview')

    def _is_valid_interview_datetime(self, interview_datetime):
        # aware times comparison
        if interview_datetime is None or interview_datetime < now_timezone():
            raise ValidationError('You cannot create a interview in the past!', code='expired_datetime')

########################################################################################################################
#                                                   FUNCTION HELPERS                                                   #
########################################################################################################################


def is_valid_file(uploaded_file):
    if not uploaded_file.content_type in settings.SEEVCAM_UPLOAD_FILE_MIME_TYPES:
        raise ValidationError("Please use a file with a different format.", code="invalid_file_format")

    if uploaded_file.size > settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE:
        error_msg = "Please keep filesize under %s" % settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE
        raise ValidationError(error_msg, code='file exceeds maximum size')

    return True
