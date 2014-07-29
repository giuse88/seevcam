from django.core.urlresolvers import reverse
from django.shortcuts import redirect, get_object_or_404
from django.views.generic import ListView, CreateView, DeleteView, TemplateView

from models import QuestionCatalogue, Question
from common.mixins.authorization import LoginRequired
from common.mixins.pjax import PJAXResponseMixin
from questions.helpers import CatalogueQuerySetHelper


class CatalogueView(LoginRequired, PJAXResponseMixin, ListView):
    model = QuestionCatalogue
    template_name = 'questions.html'

    def dispatch(self, request, *args, **kwargs):
        if self._is_seevcam_scope():
            catalogue = CatalogueQuerySetHelper.get_first_catalogue_of_seevcam()
        else:
            catalogue = CatalogueQuerySetHelper.get_first_catalogue_or_none(self.request.user.id)
        if catalogue is not None:
            # Todo get_absolute url
            return redirect(reverse('questions_list', args=[catalogue.id]) + "?scope=" + catalogue.catalogue_scope)
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


class CatalogueViewList(LoginRequired, PJAXResponseMixin, TemplateView):
    template_name = 'questions.html'
    pjax_url = True

    def get_context_data(self, **kwargs):
        context = super(CatalogueViewList, self).get_context_data(**kwargs)
        scope = self._get_request_scope()
        catalogue_pk = self.kwargs['catalogue_pk']
        # TODO refacator
        if self._is_seevcam_scope():
            catalogue = get_object_or_404(QuestionCatalogue, pk=catalogue_pk, catalogue_scope=scope)
            catalogue_list = CatalogueQuerySetHelper.seevcam_catalogue_queryset().order_by('catalogue_name')
        else:
            catalogue = get_object_or_404(QuestionCatalogue, pk=catalogue_pk, catalogue_scope=scope,
                                          catalogue_owner=self.request.user.id)
            catalogue_list = CatalogueQuerySetHelper.user_catalogue_queryset(self.request.user.id).order_by(
                'catalogue_name')
        context['catalogue'] = catalogue
        context['question_list'] = Question.objects.filter(question_catalogue=catalogue_pk)
        context['questioncatalogue_list'] = catalogue_list
        context['scope'] = scope
        return context

    def _get_request_scope(self):
        scope = self.request.GET.get('scope')
        if scope is None or scope.lower() == QuestionCatalogue.PRIVATE_SCOPE.lower():
            return QuestionCatalogue.PRIVATE_SCOPE
        return QuestionCatalogue.SEEVCAM_SCOPE

    def _is_seevcam_scope(self):
        scope = self.request.GET.get('scope')
        if scope is None:
            return False
        return scope.lower() == QuestionCatalogue.SEEVCAM_SCOPE.lower()

    def get(self, request, *args, **kwargs):
        response = super(PJAXResponseMixin, self).get(request, *args, **kwargs)
        response['X-PJAX-URL'] = self.request.path + "?scope=" + self._get_request_scope().lower()
        return response


# They should be only ajax views
class CreateCatalogueView(LoginRequired, CreateView):
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

class DeleteCatalogueView(LoginRequired, DeleteView):
    success_url = '/dashboard/questions/'
    model = QuestionCatalogue


class CreateQuestion(LoginRequired, CreateView):
    fields = ('question_text',)
    model = QuestionCatalogue
    template_name = 'questions-catalogue-pjax.html'

    def form_valid(self, form):
        form.instance.question_catalogue = self.kwargs['catalogue_pk']
        form.save()
        return super(CreateCatalogueView, self).form_valid(form)

    def get_success_url(self):
        return reverse('questions_list', args=[self.object.id])



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


