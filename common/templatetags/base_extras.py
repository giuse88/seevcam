from django import template
from django.core import urlresolvers
from common.helpers.timezone import to_user_timezone
import datetime

register = template.Library()

@register.simple_tag(takes_context=True)
def current(context, url_name, return_value=' active', **kwargs):
    matches = current_url_equals(context, url_name, **kwargs)
    return return_value if matches else ''


def current_url_equals(context, url_name, **kwargs):
    resolved = False
    try:
        resolved = urlresolvers.resolve(context.get('request').path)
    except:
        pass
    matches = resolved and resolved.url_name == url_name
    if matches and kwargs:
        for key in kwargs:
            kwarg = kwargs.get(key)
            resolved_kwarg = resolved.kwargs.get(key)
            if not resolved_kwarg or kwarg != resolved_kwarg:
                return False
    return matches

@register.inclusion_tag("components/current-datetime.html")
def current_datetime_component(request):
    user_datetime_now = to_user_timezone(datetime.datetime.now(),request.user)
    if user_datetime_now.hour>11:
        pm_active = 'active'
        am_active = ''
    else:
        am_active = 'active'
        pm_active = ''        

    return {
        'hour': user_datetime_now.strftime('%I'),
        'minute': user_datetime_now.strftime('%M'),
        'day': user_datetime_now.day,
        'month': user_datetime_now.month,
        'year': user_datetime_now.year,
        'am_active': am_active,
        'pm_active': pm_active
    }