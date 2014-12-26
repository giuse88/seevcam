from django.core.urlresolvers import reverse
from django.db.models import Q
from django.shortcuts import redirect, get_object_or_404
from django.views.generic import ListView, CreateView, TemplateView, UpdateView
from django.views.generic.edit import BaseDeleteView

from common.mixins.ajax import AJAXPost
from .models import QuestionCatalogue, Question
from common.mixins.authorization import LoginRequired
from common.mixins.pjax import PJAXResponseMixin
from questions.helpers import CatalogueQuerySetHelper


class CatalogueView_2(LoginRequired, ListView):
    model = QuestionCatalogue
    template_name = 'questions-catalogue.html'

    def get_queryset(self):
        return QuestionCatalogue.objects.filter(Q(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE) |
                                                Q(catalogue_owner=self.request.user.id)).order_by('catalogue_name')


class CatalogueView(LoginRequired, PJAXResponseMixin, ListView):
    model = QuestionCatalogue
    template_name = 'questions.html'

    def dispatch(self, request, *args, **kwargs):
        catalogue = self._get_first_catalogue_according_to_scope()
        if catalogue is not None:
            return redirect(reverse('questions_list', args=[catalogue.id]) + "?scope=" + catalogue.catalogue_scope)
        return super(CatalogueView, self).dispatch(request, *args, **kwargs)

    def get_queryset(self):
        queryset = self._get_queryset_according_to_scope()
        return queryset.order_by('catalogue_name')

    def get_context_data(self, **kwargs):
        context = super(CatalogueView, self).get_context_data(**kwargs)
        context['scope'] = get_request_scope(self.request)
        context['question_list'] = None
        return context

    def _get_queryset_according_to_scope(self):
        if is_seevcam_scope(self.request):
            return CatalogueQuerySetHelper.seevcam_catalogue_queryset()
        return CatalogueQuerySetHelper.user_catalogue_queryset(self.request.user.id)

    def _get_first_catalogue_according_to_scope(self):
        if is_seevcam_scope(self.request):
            return CatalogueQuerySetHelper.get_first_catalogue_of_seevcam()
        return CatalogueQuerySetHelper.get_first_catalogue_or_none(self.request.user.id)


class CatalogueViewList(LoginRequired, PJAXResponseMixin, TemplateView):
    template_name = 'questions.html'
    pjax_url = True

    def get_context_data(self, **kwargs):
        context = super(CatalogueViewList, self).get_context_data(**kwargs)
        scope = get_request_scope(self.request)
        catalogue_pk = self.kwargs['catalogue_pk']
        context['selected_catalogue'] = self._get_catalogue_according_to_scope(catalogue_pk, scope)
        context['question_list'] = Question.objects.filter(question_catalogue=catalogue_pk)
        context['questioncatalogue_list'] = self._get_queryset_according_to_scope().order_by('catalogue_name')
        context['scope'] = scope
        return context

    def get(self, request, *args, **kwargs):
        response = super(CatalogueViewList, self).get(request, *args, **kwargs)
        response['X-PJAX-URL'] = self.request.path + "?scope=" + get_request_scope(self.request).lower()
        return response

    def _get_catalogue_according_to_scope(self, catalogue_pk, scope):
        if is_seevcam_scope(self.request):
            return get_object_or_404(QuestionCatalogue, pk=catalogue_pk, catalogue_scope=scope)
        return get_object_or_404(QuestionCatalogue, pk=catalogue_pk, catalogue_scope=scope,
                                 catalogue_owner=self.request.user.id)

    def _get_queryset_according_to_scope(self):
        if is_seevcam_scope(self.request):
            return CatalogueQuerySetHelper.seevcam_catalogue_queryset()
        return CatalogueQuerySetHelper.user_catalogue_queryset(self.request.user.id)


# ############################################################
# CRUD operations Catalogue                   #
# ############################################################

class CreateCatalogueView(LoginRequired, AJAXPost, CreateView):
    fields = ('catalogue_name',)
    model = QuestionCatalogue
    template_name = 'questions-catalogue-pjax.html'

    def form_valid(self, form):
        form.instance.catalogue_owner = self.request.user
        form.instance.catalogue_scope = QuestionCatalogue.PRIVATE_SCOPE
        form.save()
        return super(CreateCatalogueView, self).form_valid(form)

    def get_success_url(self):
        return reverse('questions_list', args=[self.object.id])


class DeleteCatalogueView(LoginRequired, AJAXPost, BaseDeleteView):
    model = QuestionCatalogue

    def delete(self, request, *args, **kwargs):
        catalogue = self.get_object()
        Question.objects.filter(question_catalogue=catalogue).delete()
        return super(DeleteCatalogueView, self).delete(request, *args, **kwargs)

    def get_success_url(self):
        if int(self.kwargs['pk']) != int(self.object.id):
            return reverse('questions_list', args=[self.object.id])
        return reverse('catalogues')


class UpdateCatalogueView(LoginRequired, AJAXPost, UpdateView):
    model = QuestionCatalogue
    fields = ('catalogue_name',)
    template_name = 'questions-catalogue-pjax.html'

    def get_success_url(self):
        if int(self.kwargs['pk']) != int(self.object.id):
            return reverse('questions_list', args=[self.object.id])
        return reverse('catalogues')


#############################################################
#               CRUD operations   Question                  #
#############################################################


class CreateQuestionView(LoginRequired, AJAXPost, CreateView):
    fields = ('question_text',)
    model = Question
    template_name = 'questions-list-pjax.html'

    def form_valid(self, form):
        form.instance.question_catalogue = QuestionCatalogue.objects.get(pk=self.kwargs['catalogue_pk'])
        form.save()
        return super(CreateQuestionView, self).form_valid(form)

    def get_success_url(self):
        return reverse('questions_list', args=[self.kwargs['catalogue_pk']])


class DeleteQuestionView(LoginRequired, AJAXPost, BaseDeleteView):
    model = Question

    def get_success_url(self):
        return reverse('questions_list', args=[self.kwargs['catalogue_pk']])


class UpdateQuestionView(LoginRequired, AJAXPost, UpdateView):
    fields = ('question_text',)
    model = Question
    template_name = 'questions-list-pjax.html'

    def get_success_url(self):
        return reverse('questions_list', args=[self.kwargs['catalogue_pk']])


#############################################################
#                   HELPER METHODS                          #
#############################################################


def is_seevcam_scope(request):
    scope = request.GET.get('scope')
    if scope is None:
        return False
    return scope.lower() == QuestionCatalogue.SEEVCAM_SCOPE.lower()


def get_request_scope(request):
    scope = request.GET.get('scope')
    if scope is None or scope.lower() == QuestionCatalogue.PRIVATE_SCOPE.lower():
        return QuestionCatalogue.PRIVATE_SCOPE
    return QuestionCatalogue.SEEVCAM_SCOPE
