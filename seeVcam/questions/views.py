from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from models import QuestionCatalogue, Question
from serializers import QuestionCatalogueSerializer, QuestionSerializer
from permissions import IsOwner, IsCatalogueOwner





# TODO REMOVE
# Create your views here.
def quest_list(request):
    template = 'questions/quest_list.html'
    context = {}
    return render(request, template, context)


class QuestionCatalogueList(generics.ListCreateAPIView):
    serializer_class = QuestionCatalogueSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def pre_save(self, obj):
        obj.catalogue_owner = self.request.user

    def get_queryset(self):
        user = self.request.user
        return QuestionCatalogue.objects.filter(catalogue_owner=user)


class QuestionCatalogueDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionCatalogueSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def pre_save(self, obj):
        obj.catalogue_owner = self.request.user

    def get_queryset(self):
        user = self.request.user
        return QuestionCatalogue.objects.filter(catalogue_owner=user)


class QuestionList(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = (IsAuthenticated, IsCatalogueOwner,)

    def post(self, request, *args, **kwargs):
        request.DATA[u'question_catalogue'] = kwargs['question_catalogue']
        return super(QuestionList, self).post(request, args, kwargs)

    def get_queryset(self):
        pk = self.kwargs['question_catalogue']
        return Question.objects.filter(question_catalogue=pk)


class QuestionDetails(generics.RetrieveUpdateDestroyAPIView):
    lookup_url_kwarg = 'question_catalogue'
    serializer_class = QuestionSerializer
    permission_classes = (IsAuthenticated, IsCatalogueOwner,)
