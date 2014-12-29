from rest_framework.generics import RetrieveAPIView, UpdateAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .serializer import AnswerSerializer
from .models import Answer


class AnswerList(ListCreateAPIView):
    serializer_class = AnswerSerializer
    model = Answer

    def get_queryset(self):
        return Answer.objects.filter(interview=self.kwargs['interview_id'])


class AnswerDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = AnswerSerializer
    model = Answer

    def get_queryset(self):
        return Answer.objects.filter(interview=self.kwargs['interview_id'],
                                     pk=self.kwargs['interview_id'])
