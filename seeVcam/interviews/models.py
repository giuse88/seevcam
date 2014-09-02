from django.db import models
from django.conf import settings

from questions.models import QuestionCatalogue


class Interview(models.Model):
    # Hidden
    interview_owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False)
    # this must become interview status
    is_interview_open = models.BooleanField(null=False, blank=False, default=False)

    interview_date = models.DateField(null=False, blank=False)
    interview_time = models.TimeField(null=False, blank=False)
    interview_job_description = models.FileField(null=False, blank=False, upload_to='/')
    interview_catalogue = models.ForeignKey(QuestionCatalogue, null=True, blank=True)
    interview_description = models.CharField(max_length=1000, null=False, blank=True, default='')

    candidate_name = models.CharField(max_length=255, null=False, blank=False)
    candidate_surname = models.CharField(max_length=255, null=False, blank=False)
    candidate_email = models.EmailField(null=False, blank=False)
    candidate_cv = models.FileField(null=False, blank=False, upload_to='/')


