from django import template
from django.utils.safestring import mark_safe
from rest_framework.renderers import JSONRenderer
from interviews.serializers import InterviewSerializer, JobPositionSerializer
from questions.models import Question
from questions.serializers import QuestionCatalogueSerializer, QuestionSerializer

register = template.Library()

@register.filter(name='interview_to_json')
def interview_to_json(interview):
    serializer = InterviewSerializer(interview)
    data = serializer.data
    return mark_safe(JSONRenderer().render(data).decode("utf-8"))

@register.filter(name='catalogue_to_json')
def catalogue_to_json(catalogue):
    questions = Question.objects.filter(question_catalogue=catalogue.id)
    serializer = QuestionSerializer(questions)
    data = serializer.data
    return mark_safe(JSONRenderer().render(data).decode("utf-8"))

@register.filter(name='job_position_to_json')
def interview_to_json(job_position):
    serializer = JobPositionSerializer(job_position)
    data = serializer.data
    return mark_safe(JSONRenderer().render(data).decode("utf-8"))
