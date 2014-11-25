from rest_framework import generics
from common.helpers.views_helper import set_company_info
from interviews.models import Interview
from interviews.serializers import InterviewSerializer


class IsOwner(object):

    def has_object_permission(self, request, view, obj):
        return obj.catalogue_owner == request.user



class InterviewList(generics.ListCreateAPIView):
    serializer_class = InterviewSerializer

    def pre_save(self, obj):
        obj.owner = self.request.user
        set_company_info(obj.job_position, self.request.user.company, self.request.user)
        set_company_info(obj.candidate, self.request.user.company, self.request.user)

    def get_queryset(self):
        return Interview.objects.filter(owner=self.request.user.id, status=Interview.OPEN)


class InterviewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InterviewSerializer

    def pre_save(self, obj):
        obj.owner = self.request.user
        set_company_info(obj.job_position, self.request.user.company, self.request.user)
        set_company_info(obj.candidate, self.request.user.company, self.request.user)

    def get_queryset(self):
        return Interview.objects.filter(owner=self.request.user.id, status=Interview.OPEN)


