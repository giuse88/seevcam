from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from common.mixins.authorization import LoginRequired
from django.views.generic import ListView
from notes.models import Notes
from interviews.models import Interview
from notes.serializer import NoteSerializer
from random import randint

class NotesRESTView(RetrieveAPIView, UpdateAPIView):
    serializer_class = NoteSerializer
    model = Notes


class NotesView(LoginRequired,ListView):
    template_name = 'notes.html'

    def get_context_data(self, **kwargs):
        context = super(ListView, self).get_context_data(**kwargs)
        
        context['pk'] = self.kwargs['pk']

        context['adaptibility'] = randint(0,100)
        context['attitude'] = randint(0,100)
        context['teamwork'] = randint(0,100)
        context['reactiity'] = randint(0,100)
        context['social'] = randint(0,100)
        context['rating'] = randint(0,100)

        context['interview'] = Interview.objects.filter(interview_owner=self.request.user.id,id=self.kwargs['pk'])[0]

        return context


class NotesListView(NotesView):
    template_name = 'notes-list.html'

    def get_queryset(self):
        return Notes.objects.filter(interview__interview_owner=self.request.user.id)

class NotesQuestionsView(NotesView):
    template_name = 'notes-questions.html'

    def get_queryset(self):
        return Notes.objects.filter(interview__interview_owner=self.request.user.id)

