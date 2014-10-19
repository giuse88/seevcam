from django.db import models
from django.conf import settings

from common.helpers.file_upload import upload_job_spec, upload_cv
from questions.models import QuestionCatalogue


class Interview(models.Model):

    ONGOING = 'ONGOING'
    OPEN = 'OPEN'
    CLOSED = 'CLOSED'
    EXPIRED = 'EXPIRED'
    STATUS = ((ONGOING, 'ongoing'), (CLOSED, 'closed'), (OPEN, 'open'), (EXPIRED, 'expired'))
    INTERVIEW_DURATION = ((15, '15 m'), (30, '30 m'), (60, '1 h'), (120, '2 h'))

    interview_status = models.CharField(max_length=255, choices=STATUS, default=OPEN, null=False, blank=False)
    interview_owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False)
    interview_datetime = models.DateTimeField(null=False, blank=False)
    interview_datetime_end = models.DateTimeField(null=False, blank=False)
    interview_position = models.CharField(max_length=255, null=False, blank=False)
    interview_job_description = models.FileField(null=True, blank=True, upload_to=upload_job_spec)
    interview_catalogue = models.ForeignKey(QuestionCatalogue, null=True, blank=True)
    interview_description = models.TextField(max_length=1000, null=False, blank=True, default='')
    interview_duration = models.PositiveIntegerField(null=False, blank=False, choices=INTERVIEW_DURATION, default=30)

    candidate_name = models.CharField(max_length=255, null=False, blank=False)
    candidate_surname = models.CharField(max_length=255, null=False, blank=False)
    candidate_email = models.EmailField(null=False, blank=False)
    candidate_cv = models.FileField(null=False, blank=False, upload_to=upload_cv)

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

    def create_notes(self):
        from notes.models import Notes
        notes = Notes(interview=self).save()
        return notes
