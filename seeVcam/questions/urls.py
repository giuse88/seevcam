from django.conf.urls import patterns, url

from questions import views


urlpatterns = patterns('',
                       url(r'^quest_list/$', views.quest_list, name='quest_list'),
                       url(r'^catalogue/$', views.QuestionCatalogueList.as_view()),
                       url(r'^catalogue/(?P<pk>[0-9]+)/$', views.QuestionCatalogueDetail.as_view()),
)