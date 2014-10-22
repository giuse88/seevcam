from django import template
register = template.Library()
import datetime
from common.helpers.timezone import to_user_timezone
from random import randint

@register.inclusion_tag("components/reports-single.html")
def report_single_component(field,request):
    return {
        'id': field.id,
        'name': field.candidate_name,
        'surname': field.candidate_surname,
        'rating': randint(0,100),
        'job_position': field.interview_position,
    }

@register.inclusion_tag("components/reports-list-single.html")
def report_list_single_component(field,request):
    return {
        'id': field.id,
        'name': field.candidate_name,
        'surname': field.candidate_surname,
        'rating': randint(0,100),
        'job_position': field.interview_position,
    }