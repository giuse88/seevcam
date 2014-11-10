from django.conf.urls import patterns, url

from questions.rest_views import QuestionCatalogueList, QuestionCatalogueDetail, QuestionCatalogueSeevcam, \
    QuestionDetails, QuestionListSeevcam, QuestionList
from dashboard.views import DashboardView as EmptyView

rest_patterns = patterns('',
                         url(r'^catalogue/?$', QuestionCatalogueList.as_view()),
                         # Seevcam Scope
                         url(r'^catalogue/seevcam/?$', QuestionCatalogueSeevcam.as_view()),
                         url(r'^catalogue/seevcam/(?P<question_catalogue>[0-9]+)/list/?$',
                             QuestionListSeevcam.as_view()),
                         # Private Scope
                         url(r'^catalogue/(?P<pk>[0-9]+)/?$', QuestionCatalogueDetail.as_view()),
                         url(r'^catalogue/(?P<question_catalogue>[0-9]+)/list/?$', QuestionList.as_view()),
                         url(r'^catalogue/(?P<question_catalogue>[0-9]+)/list/(?P<pk>[0-9]+)/?$',
                             QuestionDetails.as_view()))

html_patterns = patterns('',
                         url(r'^$', EmptyView.as_view(), name='questions'),
                         url(r'(?P<pk>[0-9]+)/?$', EmptyView.as_view(), name='openCatalogue'))

urlpatterns = rest_patterns + html_patterns