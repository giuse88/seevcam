from django.conf.urls import patterns, url
from questions.rest_views import QuestionCatalogueList, QuestionCatalogueDetail, QuestionCatalogueSeevcam, \
    QuestionDetails, QuestionListSeevcam, QuestionList

from questions.views import CatalogueView, CreateCatalogueView, DeleteCatalogueView, \
    CatalogueViewList, CreateQuestionView, UpdateCatalogueView, UpdateQuestionView, DeleteQuestionView


rest_patterns = patterns('',
                       url(r'^catalogue/$', QuestionCatalogueList.as_view()),
                       # Seevcam Scope
                       url(r'^catalogue/seevcam/$', QuestionCatalogueSeevcam.as_view()),
                       url(r'^catalogue/seevcam/(?P<question_catalogue>[0-9]+)/list/$', QuestionListSeevcam.as_view()),
                       # Private Scope
                       url(r'^catalogue/(?P<pk>[0-9]+)/$', QuestionCatalogueDetail.as_view()),
                       url(r'^catalogue/(?P<question_catalogue>[0-9]+)/list/$', QuestionList.as_view()),
                       url(r'^catalogue/(?P<question_catalogue>[0-9]+)/list/(?P<pk>[0-9]+)/$', QuestionDetails.as_view()),
)

urlpatterns = patterns('',
                       url(r'^$', CatalogueView.as_view(), name='catalogues'),
                       url(r'^create/',CreateCatalogueView.as_view(), name='catalogue_create'),
                       url(r'^(?P<pk>\d+)/delete/$', DeleteCatalogueView.as_view(), name='catalogue_delete'),
                       url(r'^(?P<pk>\d+)/update/$', UpdateCatalogueView.as_view(), name='catalogue_update'),
                       #TODO refactoring update name to conform to the catalogue model
                       url(r'^(?P<catalogue_pk>[0-9]+)/$', CatalogueViewList.as_view(), name='questions_list'),
                       url(r'^(?P<catalogue_pk>[0-9]+)/create_question/', CreateQuestionView.as_view(), name='question_create'),
                       url(r'^(?P<catalogue_pk>[0-9]+)/update_question/(?P<pk>\d+)/$', UpdateQuestionView.as_view(), name='question_update'),
                       url(r'^(?P<catalogue_pk>[0-9]+)/delete_question/(?P<pk>\d+)/$', DeleteQuestionView.as_view(), name='question_delete'),
                       ) + rest_patterns