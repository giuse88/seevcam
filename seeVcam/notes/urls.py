from django.conf.urls import patterns, url
from notes.views import NotesRESTView,NotesListView,NotesQuestionsView,NotesDescriptionView


"""
REST requests
"""
rest_url = patterns('',
                    url(r'(?P<pk>[0-9]+)/notes/$', NotesRESTView.as_view()),
)

"""
HTML requests
"""
default_url = patterns('',
	url(r'^list$',NotesListView.as_view(),name="notes-list" ),
	url(r'^questions$',NotesQuestionsView.as_view(),name="notes-questions" ),
	url(r'^description$',NotesDescriptionView.as_view(),name="notes-jobdescription" ),
)


urlpatterns = default_url
# urlpatterns = rest_url + default_url



