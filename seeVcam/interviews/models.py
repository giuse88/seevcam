from django.db import models
from django.conf import settings

from questions.models import QuestionCatalogue


class Interview(models.Model):

    # ask in stack overflow
    ONGOING = 'ONGOING'
    OPEN = 'OPEN'
    CLOSED = 'CLOSED'
    STATUS = (
        (ONGOING, 'ongoing'),
        (CLOSED, 'closed'),
        (OPEN, 'open'),
    )
    interview_status = models.CharField(max_length=255, choices=STATUS, default=OPEN, null=False,
                                       blank=False)
    interview_owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False)


    interview_date = models.DateField(null=False, blank=False)
    interview_time = models.TimeField(null=False, blank=False)
    interview_job_description = models.FileField(null=False, blank=False, upload_to='/')
    interview_catalogue = models.ForeignKey(QuestionCatalogue, null=True, blank=True)
    interview_description = models.CharField(max_length=1000, null=False, blank=True, default='')

    candidate_name = models.CharField(max_length=255, null=False, blank=False)
    candidate_surname = models.CharField(max_length=255, null=False, blank=False)
    candidate_email = models.EmailField(null=False, blank=False)
    candidate_cv = models.FileField(null=False, blank=False, upload_to='/')


