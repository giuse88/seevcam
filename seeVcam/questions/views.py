from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import ListView, CreateView, DeleteView
from django.views.generic.base import TemplateResponseMixin
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from models import QuestionCatalogue, Question
from serializers import QuestionCatalogueSerializer, QuestionSerializer
from permissions import IsOwner, IsCatalogueOwnerOrSeevcamScope, ReadOnly
from common.mixins.authorization import LoginRequired






class CatalogueView(LoginRequired, ListView):
    model = QuestionCatalogue
    template_name = 'questions_base.html'

    def get_queryset(self):
        if self._is_seevcam_scope():
            return self._seevcam_catalogue_queryset()
        return self._user_catalogue_queryset()

    def get_context_data(self, **kwargs):
        context = super(CatalogueView, self).get_context_data(**kwargs)
        context['scope'] = self._get_request_scope()
        return context

    def _is_seevcam_scope(self):
        scope = self.request.GET.get('scope')
        if scope is None:
            return False
        return scope.lower() == QuestionCatalogue.SEEVCAM_SCOPE.lower()

    def _get_request_scope(self):
        scope = self.request.GET.get('scope')
        if scope is None or scope.lower() == QuestionCatalogue.PRIVATE_SCOPE.lower():
            return QuestionCatalogue.PRIVATE_SCOPE
        return QuestionCatalogue.SEEVCAM_SCOPE

    def _user_catalogue_queryset(self):
        return QuestionCatalogue.objects.filter(catalogue_owner=self.request.user.id)

    def _seevcam_catalogue_queryset(self):
        return QuestionCatalogue.objects.filter(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE)


class CatalogueView_(ListView):
    model = QuestionCatalogue
    template_name = 'catalogue_list.html'

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(CatalogueView_, self).dispatch(*args, **kwargs)

    def get_queryset(self):
        if self._is_seevcam_scope():
            return self._seevcam_catalogue_queryset()
        return self._user_catalogue_queryset()

    def get_context_data(self, **kwargs):
        context = super(CatalogueView_, self).get_context_data(**kwargs)
        context['scope'] = self._get_request_scope()
        return context

    def _is_seevcam_scope(self):
        scope = self.request.GET.get('scope')
        if scope is None:
            return False
        return scope.lower() == QuestionCatalogue.SEEVCAM_SCOPE.lower()

    def _get_request_scope(self):
        scope = self.request.GET.get('scope')
        if scope is None or scope.lower() == QuestionCatalogue.PRIVATE_SCOPE.lower():
            return QuestionCatalogue.PRIVATE_SCOPE
        return QuestionCatalogue.SEEVCAM_SCOPE

    def _user_catalogue_queryset(self):
        return QuestionCatalogue.objects.filter(catalogue_owner=self.request.user.id)

    def _seevcam_catalogue_queryset(self):
        return QuestionCatalogue.objects.filter(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE)


class CreateCatalogueView(CreateView):
    success_url = '/dashboard/questions/get'
    fields = ('catalogue_name',)
    model = QuestionCatalogue
    template_name = 'catalogue_list.html'

    def form_valid(self, form):
        form.instance.catalogue_owner = self.request.user
        form.instance.catalogue_scope = QuestionCatalogue.PRIVATE_SCOPE
        form.save()
        return super(CreateCatalogueView, self).form_valid(form)

class DeleteCatalogueView(DeleteView):
    success_url = '/dashboard/questions/get'
    model = QuestionCatalogue

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(DeleteCatalogueView, self).dispatch(*args, **kwargs)

class QuestionsListView(CatalogueView):
    model = Question
    template_name = 'questions_list.html'

    def get_queryset(self):
        pk = self.kwargs['pk']
        return Question.objects.filter(question_catalogue=pk)

    def get_context_data(self, **kwargs):
        context = super(QuestionsListView, self).get_context_data(**kwargs)
        print self.request.GET.get('_pjax')
        # context['questioncatalogue_list'] = self._get_request_scope()
        return context

        # def _get_catalogues


# ####
# ## REST
#####


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
        user = self.request.user
        return QuestionCatalogue.objects.filter(catalogue_owner=user)


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
