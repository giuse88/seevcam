from datetime import datetime

from django import forms
from django.core.exceptions import ValidationError

from models import Interview


class CreateInterviewForm(forms.ModelForm):

    class Meta:
        model = Interview
        fields = ['candidate_name', 'candidate_surname', 'candidate_email', 'candidate_cv',
                  'interview_date', 'interview_time', 'interview_description', 'interview_position',
                  'interview_catalogue', 'interview_job_description']

    def __init__(self, user, *args, **kwargs):
        super(CreateInterviewForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean(self):
        cleaned_data = super(CreateInterviewForm, self).clean()
        interview_time = cleaned_data.get('interview_time')
        interview_date = cleaned_data.get('interview_date')
        self._is_valid_date(interview_date)
        self._is_valid_time(interview_date, interview_time)
        self._is_already_booked(interview_date, interview_time)
        return cleaned_data

    def _validate_file_extension(self, file):
        if not ( file.endswith('.pdf') or file.endswith('.doc') or file.endswith('.docx')):
            raise ValidationError('You can upload only pdf and doc/docs.',
                                  code='invalid_file_extension')

    def _is_already_booked(self, interview_date, interview_time):
        interview = Interview.objects.filter(interview_date=interview_date,
                                             interview_time=interview_time,
                                             interview_owner=self.user.id)
        if interview.exists():
            self._errors["interview_time"] = self.error_class(["Please check interview time"])
            self._errors["interview_date"] = self.error_class(["Please check interview date"])
            raise ValidationError('Another interview has already been scheduled for the date selected.',
                                  code='already_scheduled_interview')

    def _is_valid_time(self, interview_date, interview_time):
        interview_date_and_time = datetime.combine(interview_date, interview_time)
        if interview_date_and_time < datetime.now():
            self._errors["interview_time"] = self.error_class(["Please check interview time"])
            raise ValidationError('You cannot create a interview in the past!', code='expired_datetime')

    def _is_valid_date(self, interview_date):
        if datetime.now().date() > interview_date:
            self._errors["interview_date"] = self.error_class(["Please check interview date"])
            raise ValidationError('You cannot create a interview in the past!', code='expired_datetime')

