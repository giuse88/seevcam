from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from notes.models import Notes
from notes.serializer import NoteSerializer


class NotesRESTView(RetrieveAPIView, UpdateAPIView):
    serializer_class = NoteSerializer
    model = Notes

