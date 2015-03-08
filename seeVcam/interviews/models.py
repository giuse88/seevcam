import random
import string
from django.db import models
from common.mixins.model import UpdateCreateTimeStamp, CompanyInfo
from file_upload_service.models import UploadedFile
from questions.models import QuestionCatalogue
from opentok import OpenTok
from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver


class Candidate(UpdateCreateTimeStamp, CompanyInfo):

    name = models.CharField(db_index=True, max_length=255, null=False, blank=False)
    surname = models.CharField(db_index=True, max_length=255, null=False, blank=False)
    email = models.EmailField(db_index=True, null=False, blank=False)
    cv = models.OneToOneField(UploadedFile, primary_key=False, null=False, blank=False, unique=True)

    def __str__(self):
        return "{0} {1} {2}".format(self.name, self.surname, self.email)

    class Meta:
        verbose_name = 'candidate'
        verbose_name_plural = 'candidates'
        db_table = "candidates"


class JobPosition(UpdateCreateTimeStamp, CompanyInfo):

    position = models.CharField(max_length=255, null=False, blank=False)
    job_description = models.OneToOneField(UploadedFile, null=False, blank=False)

    def __str__(self):
        return "{0}".format(self.position)

    class Meta:
        verbose_name = 'job_position'
        verbose_name_plural = 'job_positions'
        db_table = "job_positions"


class Interview(UpdateCreateTimeStamp):

    ONGOING = 'ONGOING'
    OPEN = 'OPEN'
    CLOSED = 'CLOSED'
    EXPIRED = 'EXPIRED'
    STATUS = ((ONGOING, 'ongoing'), (CLOSED, 'closed'), (OPEN, 'open'), (EXPIRED, 'expired'))
    INTERVIEW_DURATION = ((15, '15 m'), (30, '30 m'), (60, '1 h'), (120, '2 h'))

    status = models.CharField(max_length=255, choices=STATUS, default=OPEN, null=False, blank=False)

    start = models.DateTimeField(null=False, blank=False)
    end = models.DateTimeField(null=False, blank=False)

    # May or May not use a catalogue
    catalogue = models.ForeignKey(QuestionCatalogue, null=True, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False)
    job_position = models.ForeignKey(JobPosition, null=False, blank=False)
    candidate = models.ForeignKey(Candidate, null=False, blank=False)
    session_id = models.CharField(max_length=255, null=False, blank=False, default='UNKNOWN')
    token = models.CharField(max_length=255, null=False, blank=False, default='UNKNOWN')
    overall_score = models.FloatField(null=True, blank=True)

    @staticmethod
    def create_interview_session():
        if settings.ENVIRONMENT != "TEST":
            opentok = OpenTok(settings.OPENTOK_API_KEY, settings.OPENTOK_SECRET)
            session = opentok.create_session()
            return session.session_id
        return "UNKNOWN"

    @staticmethod
    def create_authentication_token():
        return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(80))

    def create_overall_ratings(self):
        from overall_ratings.models import OverallRatingQuestion, OverallRating
        for rating_question in OverallRatingQuestion.objects.all():
            rating = OverallRating(interview=self, question=rating_question)
            rating.save()

    def create_notes(self):
        from notes.models import Notes
        notes = Notes(interview=self)
        notes.save()

    @property
    def job_position_name(self):
        return self.job_position.position

    class Meta:
        verbose_name = 'interview'
        verbose_name_plural = 'interviews'
        db_table = "interviews"


@receiver(pre_save, sender=Interview)
def create_authentication_token(sender, instance, **kwargs):
    if not instance.token or instance.token == "UNKNOWN":
        instance.token = Interview.create_authentication_token()


@receiver(pre_save, sender=Interview)
def create_session_token(sender, instance, **kwargs):
    if not instance.session_id or instance.session_id == "UNKNOWN":
        instance.session_id = Interview.create_interview_session()

