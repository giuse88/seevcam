from django.conf.urls import patterns, url
from django.views.generic import RedirectView
from questions import views


# urlpatterns = patterns('',
#                        url(r'^$', views.quest_list, name='questions'),
#                        url(r'^catalogue/$', views.QuestionCatalogueList.as_view()),
#                        # Seevcam Scope
#                        url(r'^catalogue/seevcam/$', views.QuestionCatalogueSeevcam.as_view()),
#                        url(r'^catalogue/seevcam/(?P<question_catalogue>[0-9]+)/list/$',
#                            views.QuestionListSeevcam.as_view()),
#                        # Private Scope
#                        url(r'^catalogue/(?P<pk>[0-9]+)/$', views.QuestionCatalogueDetail.as_view()),
#                        url(r'^catalogue/(?P<question_catalogue>[0-9]+)/list/$', views.QuestionList.as_view()),
#                        url(r'^catalogue/(?P<question_catalogue>[0-9]+)/list/(?P<pk>[0-9]+)/$',
#                            views.QuestionDetails.as_view()),
# )
from questions.views import CatalogueView, CreateCatalogueView, DeleteCatalogueView, \
    CatalogueViewList, CreateQuestion, UpdateCatalogueView


urlpatterns = patterns('',
                       url(r'^$', CatalogueView.as_view(), name='catalogues'),
                       url(r'^create/',CreateCatalogueView.as_view(), name='catalogue_create'),
                       url(r'^delete/(?P<pk>\d+)/$', DeleteCatalogueView.as_view(), name='catalogue_delete'),
                       url(r'^(?P<pk>\d+)/update/$', UpdateCatalogueView.as_view(), name='catalogue_update'),
                       #TODO refactoring update name to conform to the catalogue model
                       url(r'^(?P<catalogue_pk>[0-9]+)/$', CatalogueViewList.as_view(), name='questions_list'),
                       url(r'^(?P<catalogue_pk>[0-9]+)/create_question/', CreateQuestion.as_view(), name='question_create'),
                       url(r'^(?P<catalogue_pk>[0-9]+)/update_question/(?P<pk>\d+)/$', CreateQuestion.as_view(), name='question_update'),
                       url(r'^(?P<catalogue_pk>[0-9]+)/delete_question/(?P<pk>\d+)/$', CreateQuestion.as_view(), name='question_delete'),
                       )