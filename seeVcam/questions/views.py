from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from models import QuestionCatalogue
from serializers import QuestionCatalogueSerializer
from permissions import IsCatalogueOwner


# TODO REMOVE
# Create your views here.
def quest_list(request):
    template = 'questions/quest_list.html'
    context = {}
    return render(request, template, context)


#TODO : there is logic shared between the two following  classes. This logic should be in a generic class

class QuestionCatalogueList(generics.ListCreateAPIView):
    serializer_class = QuestionCatalogueSerializer
    permission_classes = (IsAuthenticated, IsCatalogueOwner,)

    def pre_save(self, obj):
        obj.catalogue_owner = self.request.user

    def get_queryset(self):
        user = self.request.user
        return QuestionCatalogue.objects.filter(catalogue_owner=user)


class QuestionCatalogueDetail(generics.RetrieveUpdateDestroyAPIView):

    queryset = QuestionCatalogue.objects.all()
    serializer_class = QuestionCatalogueSerializer
    permission_classes = (IsAuthenticated, IsCatalogueOwner,)

    def pre_save(self, obj):
        obj.catalogue_owner = self.request.user

    def get_queryset(self):
        user = self.request.user
        return QuestionCatalogue.objects.filter(catalogue_owner=user)


