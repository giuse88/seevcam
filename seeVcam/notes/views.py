from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from common.mixins.authorization import LoginRequired
from django.views.generic import ListView, DetailView
from notes.models import Notes
from interviews.models import Interview
from notes.serializer import NoteSerializer
from random import randint
import pdb

class Question(object): pass

class NotesRESTView(RetrieveAPIView, UpdateAPIView):
    serializer_class = NoteSerializer
    model = Notes

class NotesListView(ListView):
    template_name = 'notes-list.html'

    def get_queryset(self):
        return Notes.objects.filter(interview__interview_owner=self.request.user.id,interview__id=self.kwargs['pk'])

    def get_context_data(self, **kwargs):
        context = super(NotesListView, self).get_context_data(**kwargs)
        context['pk'] = self.kwargs['pk']

        context['adaptibility'] = randint(0,100)
        context['attitude'] = randint(0,100)
        context['teamwork'] = randint(0,100)
        context['reactivity'] = randint(0,100)
        context['social'] = randint(0,100)
        context['rating'] = randint(0,100)

        context['interview'] = Interview.objects.filter(interview_owner=self.request.user.id,id=self.kwargs['pk'])[0]

        return context

class NotesQuestionsView(LoginRequired,ListView):
    template_name = 'notes-questions.html'
    context_object_name = 'questions_list'

    def get_queryset(self):
        return Notes.objects.filter(interview__interview_owner=self.request.user.id,interview__id=self.kwargs['pk'])

    def get_context_data(self, **kwargs):
        context = super(NotesQuestionsView, self).get_context_data(**kwargs)
        context['pk'] = self.kwargs['pk']

        context['adaptibility'] = randint(0,100)
        context['attitude'] = randint(0,100)
        context['teamwork'] = randint(0,100)
        context['reactivity'] = randint(0,100)
        context['social'] = randint(0,100)
        context['rating'] = randint(0,100)

        context['interview'] = Interview.objects.filter(interview_owner=self.request.user.id,id=self.kwargs['pk'])[0]


        context['questions_list'] = []

        question = Question()
        question.question = 'Which is the main reason you want to change your job?'
        question.answer = "He answered: looking for more challenging opportunities. Good motive but couldn't support during the rest of the interview."
        context['questions_list'].append(question)
        question = Question()
        question.question = 'Have you ever made a mistake? How did you handle it?'
        question.answer = "Quiet evasive, Described the mistake in many details but didn't spend too much time on the solution even when asked to go into deeper details."
        context['questions_list'].append(question)
        question = Question()
        question.question = 'Give an example of how you worked on team.'
        question.answer = 'Good use of many previous experiences, seems like he handled pressure really well.'
        context['questions_list'].append(question)

        return context

class NotesDescriptionView(LoginRequired,DetailView):
    template_name = 'notes-description.html'
    model = Interview

    def get_context_data(self, **kwargs):
        context = super(NotesDescriptionView, self).get_context_data(**kwargs)
        context['pk'] = self.kwargs['pk']

        context['adaptibility'] = randint(0,100)
        context['attitude'] = randint(0,100)
        context['teamwork'] = randint(0,100)
        context['reactivity'] = randint(0,100)
        context['social'] = randint(0,100)
        context['rating'] = randint(0,100)

        context['interview'] = Interview.objects.filter(interview_owner=self.request.user.id,id=self.kwargs['pk'])[0]

        return context
