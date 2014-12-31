from events.models import Event
from events.serializer import EventSerializer
from rest_framework.generics import ListCreateAPIView


class EventList(ListCreateAPIView):
    serializer_class = EventSerializer
    model = EventSerializer

    def pre_save(self, obj):
        obj.interview_id = self.kwargs['interview_id']

    def get_queryset(self):
        return Event.objects.filter(interview=self.kwargs['interview_id'])