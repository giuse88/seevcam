from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin
from rest_framework.views import APIView
from notes.models import Notes
from notes.serializer import NoteSerializer


class NotesRESTView(RetrieveModelMixin, UpdateModelMixin, APIView):
    serializer_class = NoteSerializer

    def get_queryset(self):
        interview_id = self.kwargs['interview_id']
        return Notes.objects.filter(interview=interview_id)