from django.conf.urls import patterns, url

from questions import views


urlpatterns = patterns('',
                       url(r'^quest_list/$', views.quest_list, name='quest_list'),
                       url(r'^catalogue/$', views.QuestionCatalogueList.as_view()),
                       url(r'^catalogue/(?P<pk>[0-9]+)/$', views.QuestionCatalogueDetail.as_view()),
                       url(r'^catalogue/(?P<question_catalogue>[0-9]+)/list/$', views.QuestionList.as_view()),
                       url(r'^catalogue/(?P<question_catalogue>[0-9]+)/list/(?P<pk>[0-9]+)/$',
                           views.QuestionDetails.as_view()),
)