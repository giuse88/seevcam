import os

from django import template

register = template.Library()
import datetime

from common.helpers.timezone import to_user_timezone


def error_container_selector(name):
    _error_container_selector = "data-parsley-errors-container:"
    _error_container_selector += "." + name + ".error-form"
    return _error_container_selector

@register.inclusion_tag("components/fileUpload.html")
def file_upload(field, uploader_name, button_text):
    return {
        'field': field,
        'uploader_name': uploader_name,
        'button_text': button_text
    }


@register.inclusion_tag("components/filter-singlefield.html")
def interviews_field(field):
    return {'field': field,
            'error_container': error_container_selector(field.name)}


@register.inclusion_tag("components/interviews-single.html")
def interview_single_component(field, request):

    user_datetime = to_user_timezone(field.start, request.user)
    user_datetime_end = to_user_timezone(field.end, request.user)

    dt = (field.start.date() - to_user_timezone(datetime.datetime.now(), request.user).date())
    user_date = user_datetime.date()
    if dt.days == 0:
        date_string = 'today'
        day = month = year = ''
        date_separator = ''
    elif dt.days == 1:
        date_string = 'tomorrow'
        day = month = year = ''
        date_separator = ''
    else:
        date_string = ''
        day = str(user_date.day)
        month = str(user_date.month)
        year = str(user_date.year)
        date_string = ''
        date_separator = '/'

    return {
        'id': field.id,
        'name': field.candidate.name,
        'surname': field.candidate.surname,
        'job_position': field.job_position.position,
        'time': user_datetime.time(),
        'end': user_datetime_end.time(),
        'date_string': date_string,
        'day': day,
        'month': month,
        'year': year,
        'date_separator': date_separator
    }


@register.inclusion_tag("components/interviews-list-single.html")
def interview_list_single_component(field, request):
    user_datetime = to_user_timezone(field.interview_datetime, request.user)
    user_datetime_end = user_datetime + datetime.timedelta(minutes=field.interview_duration)

    dt = (field.interview_datetime.date() - to_user_timezone(datetime.datetime.now(), request.user).date())
    user_date = user_datetime.date()
    if dt.days == 0:
        date_string = 'today'
        date_class = 'today'
        day = month = year = ''
        date_separator = ''
    elif dt.days == 1:
        date_string = 'tomorrow'
        date_class = 'tomorrow'
        day = month = year = ''
        date_separator = ''
    else:
        date_string = ''
        day = str(user_date.day)
        month = str(user_date.month)
        year = str(user_date.year)
        date_string = ''
        date_class = ''
        date_separator = '/'

    return {
        'id': field.id,
        'name': field.candidate_name,
        'surname': field.candidate_surname,
        'job_position': field.interview_position,
        'time': user_datetime.time(),
        'end': user_datetime_end.time(),
        'date_class': date_class,
        'date_string': date_string,
        'day': day,
        'month': month,
        'year': year,
        'date_separator': date_separator
    }


@register.inclusion_tag("components/interviews-calendar-single.html")
def interview_calendar_single_component(field, request):
    user_datetime = to_user_timezone(field.interview_datetime, request.user)
    user_datetime_end = user_datetime + datetime.timedelta(minutes=field.interview_duration)

    dt = (field.interview_datetime.date() - to_user_timezone(datetime.datetime.now(), request.user).date())
    user_date = user_datetime.date()
    if dt.days == 0:
        color = '#009145'
    elif dt.days == 1:
        color = '#0071bb'
    else:
        color = 'black'

    return {
        'id': field.id,
        'name': field.candidate_name,
        'surname': field.candidate_surname,
        'job_position': field.interview_position,
        'date_start': str(field.interview_datetime.year) + '-' + str(field.interview_datetime.month) + '-' + str(
            field.interview_datetime.day) + ' ' + str(field.interview_datetime.hour) + ':' + str(
            field.interview_datetime.minute) + ':00',
        'date_end': str(field.interview_datetime_end.year) + '-' + str(field.interview_datetime_end.month) + '-' + str(
            field.interview_datetime_end.day) + ' ' + str(field.interview_datetime_end.hour) + ':' + str(
            field.interview_datetime_end.minute) + ':00',
        'color': color
    }


@register.inclusion_tag("components/current-datetime.html")
def current_datetime_component(request):
    user_datetime_now = to_user_timezone(datetime.datetime.now(), request.user)
    if user_datetime_now.hour > 11:
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


@register.inclusion_tag("components/filter-datepickerField.html")
def datepicker_field(field, min='', max='', format='y-m-d'):
    return {
        'field': field,
        'min': min,
        'max': max,
        'format': format
    }


@register.inclusion_tag("components/filter-calendarField.html")
def calendar_field(field, end, user, min='', max='', format='y-m-d'):
    return {
        'field': field,
        'end': end,
        'user': user,
        'min': min,
        'max': max,
        'format': format
    }



@register.filter
def placeholder(value, text):
    value.field.widget.attrs["placeholder"] = text
    return value


@register.filter
def parsley(value, attributes):
    attrs = value.field.widget.attrs
    data = attributes.replace(' ', '')

    kvs = data.split(',')

    for string in kvs:
        kv = string.split(':')
        attrs[kv[0]] = kv[1]

    return value


@register.filter
def file_name(value):
    return os.path.basename(str(value))


@register.filter
def file_status_class(value):
    if value:
        return "fileinput-exists"
    else:
        return "fileinput-new"


@register.filter
def is_required(value):
    if value:
        return ""
    else:
        return "required"


@register.filter
def to_user_time(value, user):
    interview_datetime = value
    if isinstance(value, basestring):
        interview_datetime = datetime.datetime.strptime(str(value), "%Y-%m-%d %H:%M")
    return to_user_timezone(interview_datetime, user)


# THis sucks
# It should come from setting fil
@register.filter
def to_seevcam_format(value):
    return value.strftime("%Y-%m-%d %H:%M")


@register.filter
def selected_catalogue_name(form):
    interview = form.instance
    if interview.catalogue is not None:
        return interview.catalogue.catalogue_name
    return ""


@register.filter
def selected_catalogue_id(form):
    interview = form.instance
    if interview.catalogue is not None:
        return interview.catalogue.id
    return ""