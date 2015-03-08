from django.core.mail import send_mail
from rest_framework import generics
from django.db.models import Q

from common.helpers.timezone import now_timezone
from common.helpers.views_helper import set_company_info
from interviews.models import Interview, JobPosition
from interviews.serializers import InterviewSerializer, JobPositionSerializer
from questions.models import Question
from questions.serializers import QuestionSerializer


def send_email_to_user(interview):
    text = "To access the interview click the following link: "
    link = "http://staging.seevcam.com/interview/1/{id}/{token}".format(id=interview.id, token=interview.token)
    candidate_email = interview.candidate.email
    send_mail('seeVcam interview', text + link, 'info@seevcam.com', [candidate_email], fail_silently=False)


class InterviewList(generics.ListCreateAPIView):
    serializer_class = InterviewSerializer

    def pre_save(self, obj):
        obj.owner = self.request.user
        set_company_info(obj.job_position, self.request.user.company, self.request.user)
        set_company_info(obj.candidate, self.request.user.company, self.request.user)

    def post_save(self, obj, created=False):
        if created:
            obj.create_notes()
            obj.create_overall_ratings()
        send_email_to_user(obj)

    def get_queryset(self):
        owner = Q(owner=self.request.user.id)
        interviews = Q(end__gt=now_timezone(), status=Interview.OPEN)
        reports = Q(status=Interview.CLOSED)
        return Interview.objects.filter(owner, interviews | reports).order_by('start')


class InterviewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InterviewSerializer

    def pre_save(self, obj):
        obj.owner = self.request.user
        set_company_info(obj.job_position, self.request.user.company, self.request.user)
        set_company_info(obj.candidate, self.request.user.company, self.request.user)

    def post_save(self, obj, created=False):
        send_email_to_user(obj)

    def get_queryset(self):
        return Interview.objects.filter(owner=self.request.user.id, status=Interview.OPEN)


class JobPositionList(generics.ListCreateAPIView):
    serializer_class = JobPositionSerializer

    def pre_save(self, obj):
        obj.created_by = self.request.user
        obj.company = self.request.user.company

    def get_queryset(self):
        return JobPosition.objects.filter(company=self.request.user.company)


class InterviewQuestions(generics.ListAPIView):
    serializer_class = QuestionSerializer
    model = Question

    def get_queryset(self):
        interview = Interview.objects.get(pk=self.kwargs['pk'])
        return Question.objects.filter(question_catalogue=interview.catalogue_id)
