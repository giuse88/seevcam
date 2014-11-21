from django.db import models
from django.conf import settings

from common.helpers.file_upload import upload_job_spec, upload_cv
from common.mixins.model import UpdateCreateTimeStamp, CompanyInfo
from questions.models import QuestionCatalogue


class Interview(models.Model, UpdateCreateTimeStamp):

    ONGOING = 'ONGOING'
    OPEN = 'OPEN'
    CLOSED = 'CLOSED'
    EXPIRED = 'EXPIRED'
    STATUS = ((ONGOING, 'ongoing'), (CLOSED, 'closed'), (OPEN, 'open'), (EXPIRED, 'expired'))
    INTERVIEW_DURATION = ((15, '15 m'), (30, '30 m'), (60, '1 h'), (120, '2 h'))

    status = models.CharField(max_length=255, choices=STATUS, default=OPEN, null=False, blank=False)

    start = models.DateTimeField(null=False, blank=False)
    end = models.DateTimeField(null=False, blank=False)
    duration = models.PositiveIntegerField(null=False, blank=False, choices=INTERVIEW_DURATION, default=30)

    # May or May not use a catalogue
    catalogue = models.ForeignKey(QuestionCatalogue, null=True, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False)
    job_position = models.ForeignKey(QuestionCatalogue, null=False, blank=False)
    candidate = models.ForeignKey(Candidate, null=False, blank=False)

    class Meta:
        db_table = "interviews"


class Candidate(models.Model, UpdateCreateTimeStamp, CompanyInfo):

    name = models.CharField(db_index=True, max_length=255, null=False, blank=False)
    surname = models.CharField(db_index=True, max_length=255, null=False, blank=False)
    email = models.EmailField(db_index=True, null=False, blank=False, unique=True)
    cv = models.FileField(null=False, blank=False, upload_to=upload_cv)

    class Meta:
        db_table = "candidates"


class JobPosition(models.Model, UpdateCreateTimeStamp, CompanyInfo):

    interview_position = models.CharField(max_length=255, null=False, blank=False)
    interview_job_description = models.FileField(null=True, blank=True, upload_to=upload_job_spec)

    class Meta:
        db_table = "job_positions"


# Helpers

def save(self, *args, **kwargs):
    if self.pk is None:
        interview_job_description = self.interview_job_description
        candidate_cv = self.candidate_cv
        self.candidate_cv = None
        self.interview_job_description = None
        super(Interview, self).save(*args, **kwargs)
        self.interview_job_description = interview_job_description
        self.candidate_cv = candidate_cv
    self.create_notes()
    super(Interview, self).save(*args, **kwargs)

