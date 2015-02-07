import string, random
from rest_framework import generics
from opentok import OpenTok

from common.helpers.views_helper import set_company_info
from interviews.models import Interview, JobPosition
from interviews.serializers import InterviewSerializer, JobPositionSerializer
from notes.models import Notes
from common.helpers.timezone import now_timezone
from django.conf import settings


class InterviewList(generics.ListCreateAPIView):
    serializer_class = InterviewSerializer

    def pre_save(self, obj):
        obj.owner = self.request.user
        obj.session_id = self.create_interview_session()
        set_company_info(obj.job_position, self.request.user.company, self.request.user)
        set_company_info(obj.candidate, self.request.user.company, self.request.user)

    def post_save(self, obj, created=False):
        if created:
            notes = Notes(interview=obj)
            notes.save()

    def get_queryset(self):
        return Interview.objects.filter(
            owner=self.request.user.id,
            end__gt=now_timezone()).order_by('start')

 # this should be in the model
    #private
    @staticmethod
    def create_interview_session():
        # this should be a singleton
        opentok = OpenTok(settings.OPENTOK_API_KEY, settings.OPENTOK_SECRET)
        session = opentok.create_session()
        return session.session_id

    #private
    @staticmethod
    def create_authentication_token():
        return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(80))


class InterviewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InterviewSerializer

    def pre_save(self, obj):
        obj.owner = self.request.user
        set_company_info(obj.job_position, self.request.user.company, self.request.user)
        set_company_info(obj.candidate, self.request.user.company, self.request.user)

    def get_queryset(self):
        return Interview.objects.filter(owner=self.request.user.id, status=Interview.OPEN)


class JobPositionList(generics.ListCreateAPIView):
    serializer_class = JobPositionSerializer

    def pre_save(self, obj):
        obj.created_by = self.request.user
        obj.company = self.request.user.company

    def get_queryset(self):
        return JobPosition.objects.filter(company=self.request.user.company)
