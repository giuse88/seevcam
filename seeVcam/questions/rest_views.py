from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from django.db.models import Q
from models import QuestionCatalogue, Question
from serializers import QuestionCatalogueSerializer, QuestionSerializer
from permissions import IsOwner, IsCatalogueOwnerOrSeevcamScope, ReadOnly


class QuestionCatalogueSeevcam(generics.ListAPIView):
    serializer_class = QuestionCatalogueSerializer
    permission_classes = (IsAuthenticated, ReadOnly,)

    def get_queryset(self):
        return QuestionCatalogue.objects.filter(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE)


class QuestionListSeevcam(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = (IsAuthenticated, ReadOnly, )

    def get_queryset(self):
        question_catalogue = self.kwargs['question_catalogue']
        return Question.objects.filter(question_catalogue=question_catalogue)


# TODO : There are two pattern in this view which can be generalised
class QuestionCatalogueList(generics.ListCreateAPIView):
    serializer_class = QuestionCatalogueSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def pre_save(self, obj):
        obj.catalogue_owner = self.request.user

    def get_queryset(self):
        return QuestionCatalogue.objects.filter(Q(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE) |
                                                Q(catalogue_owner=self.request.user.id)).order_by('catalogue_name')


class QuestionCatalogueDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionCatalogueSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def pre_save(self, obj):
        obj.catalogue_owner = self.request.user

    def pre_delete(self, obj):
        Question.objects.filter(question_catalogue=obj).delete()

    def get_queryset(self):
        user = self.request.user
        return QuestionCatalogue.objects.filter(catalogue_owner=user)


class QuestionList(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = (IsAuthenticated, IsCatalogueOwnerOrSeevcamScope,)

    def post(self, request, *args, **kwargs):
        request.DATA[u'question_catalogue'] = kwargs['question_catalogue']
        return super(QuestionList, self).post(request, args, kwargs)

    def get_queryset(self):
        pk = self.kwargs['question_catalogue']
        return Question.objects.filter(question_catalogue=pk)


class QuestionDetails(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionSerializer
    permission_classes = (IsAuthenticated, IsCatalogueOwnerOrSeevcamScope,)
    model = Question

    def put(self, request, *args, **kwargs):
        request.DATA[u'question_catalogue'] = kwargs['question_catalogue']
        return super(QuestionDetails, self).put(request, args, kwargs)

    def get_queryset(self):
        question_catalogue = self.kwargs['question_catalogue']
        return Question.objects.filter(question_catalogue=question_catalogue)