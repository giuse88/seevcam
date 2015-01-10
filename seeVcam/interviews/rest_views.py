from rest_framework import generics
from common.helpers.views_helper import set_company_info
from interviews.models import Interview, JobPosition
from interviews.serializers import InterviewSerializer, JobPositionSerializer
from notes.models import Notes
from common.helpers.timezone import now_timezone

class InterviewList(generics.ListCreateAPIView):
    serializer_class = InterviewSerializer

    def pre_save(self, obj):
        obj.owner = self.request.user
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
