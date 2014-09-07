from datetime import datetime

from django import forms
from django.core.exceptions import ValidationError

from models import Interview


class CreateInterviewForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super(CreateInterviewForm, self).clean()
        interview_time = cleaned_data.get('interview_time')
        interview_date = cleaned_data.get('interview_date')
        # Validation date
        if datetime.now().date() > interview_date:
            self._errors["interview_date"] = self.error_class(["Please check interview date"])
            raise ValidationError('You cannot create a interview in the past!', code='expired_datetime')
        # Validation time
        interview_date_and_time = datetime.combine(interview_date, interview_time)
        if datetime.now() > interview_date_and_time:
            self._errors["interview_time"] = self.error_class(["Please check interview time"])
            raise ValidationError('You cannot create a interview in the past!', code='expired_datetime')
        # Already booked
        return cleaned_data

    def validate_file_extension(self, file):
        if not ( file.endswith('.pdf') or file.endswith('.doc') or file.endswith('.docx')):
            raise ValidationError('You can upload only pdf and doc/docs.',
                                  code='invalid_file_extension')

    class Meta:
        model = Interview
        fields = ['candidate_name', 'candidate_surname', 'candidate_email', 'candidate_cv',
                  'interview_date', 'interview_time', 'interview_description', 'interview_catalogue',
                  'interview_job_description']