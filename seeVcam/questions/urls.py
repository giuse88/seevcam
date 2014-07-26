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
from questions.views import QuestionsListView, CatalogueView, CreateCatalogueView, CatalogueView_, DeleteCatalogueView


urlpatterns = patterns('',
                       url(r'^$', CatalogueView.as_view(), name='questions'),
                       url(r'^create/',CreateCatalogueView.as_view(), name='questions_create'),
                       url(r'^get/',CatalogueView_.as_view()),
                       url(r'^(?P<pk>[0-9]+)/$', QuestionsListView.as_view(), name='questions_list'),
                       url(r'^delete/(?P<pk>\d+)/$', DeleteCatalogueView.as_view(), name='questions_delete'),
                       url(r'^catalogue/seevcam/$', views.QuestionCatalogueSeevcam.as_view()),
                       )