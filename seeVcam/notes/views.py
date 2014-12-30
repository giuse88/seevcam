from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from interviews.models import Interview
from notes.models import Notes
from notes.serializer import NoteSerializer


class NotesRESTView(RetrieveAPIView, UpdateAPIView):
    serializer_class = NoteSerializer
    model = Notes

    def get_object(self):
        return Interview.objects.get(pk=self.kwargs['interview_id']).notes

