from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.generic import ListView, CreateView, DeleteView

from models import QuestionCatalogue, Question
from common.mixins.authorization import LoginRequired
from common.mixins.pjax import PJAXResponseMixin
from questions.helpers import CatalogueQuerySetHelper


class CatalogueView(LoginRequired, PJAXResponseMixin, ListView):
    model = QuestionCatalogue
    template_name = 'questions.html'

    def dispatch(self, request, *args, **kwargs):
        catalogue = CatalogueQuerySetHelper.get_first_catalogue_or_none(self.request.user.id)
        print catalogue
        if catalogue is not None:
            return redirect(reverse('questions_list', args=[catalogue.id]))
        return super(CatalogueView, self).dispatch(request, *args, **kwargs)

    def get_queryset(self):
        if self._is_seevcam_scope():
            queryset = CatalogueQuerySetHelper.seevcam_catalogue_queryset()
        else:
            queryset = CatalogueQuerySetHelper.user_catalogue_queryset(self.request.user.id)
        return queryset.order_by('catalogue_name')

    def get_context_data(self, **kwargs):
        context = super(CatalogueView, self).get_context_data(**kwargs)
        context['scope'] = self._get_request_scope()
        context['question_list'] = None
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


class CatalogueViewList(LoginRequired, PJAXResponseMixin, ListView):
    model = QuestionCatalogue
    template_name = 'questions.html'

    def get_queryset(self):
        if self._is_seevcam_scope():
            queryset = CatalogueQuerySetHelper.seevcam_catalogue_queryset()
        else:
            queryset = CatalogueQuerySetHelper.user_catalogue_queryset()
        return queryset.order_by('catalogue_name')

    def get_context_data(self, **kwargs):
        context = super(CatalogueView, self).get_context_data(**kwargs)
        context['scope'] = self._get_request_scope()
        context['question_list'] = None
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








class CreateCatalogueView(CreateView):
    success_url = '/dashboard/questions/'
    fields = ('catalogue_name',)
    model = QuestionCatalogue
    template_name = 'questions-catalogue-pjax.html'

    def form_valid(self, form):
        form.instance.catalogue_owner = self.request.user
        form.instance.catalogue_scope = QuestionCatalogue.PRIVATE_SCOPE
        form.save()
        return super(CreateCatalogueView, self).form_valid(form)


class DeleteCatalogueView(DeleteView):
    success_url = '/dashboard/questions/'
    model = QuestionCatalogue

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(DeleteCatalogueView, self).dispatch(*args, **kwargs)


class QuestionsListView(CatalogueView):
    model = Question
    template_name = 'questions-list-pjax.html'

    def get_queryset(self):
        pk = self.kwargs['pk']
        return Question.objects.filter(question_catalogue=pk)

    def get_context_data(self, **kwargs):
        context = super(QuestionsListView, self).get_context_data(**kwargs)
        print self.request.GET.get('_pjax')
        # context['questioncatalogue_list'] = self._get_request_scope()
        return context


