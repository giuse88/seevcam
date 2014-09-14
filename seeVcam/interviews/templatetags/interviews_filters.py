from django import template
register = template.Library()

from common.helpers.timezone import to_user_timezone

def error_container_selector(name):
    _error_container_selector = "data-parsley-errors-container:"
    _error_container_selector += "."+name+".error-form"
    return _error_container_selector

@register.inclusion_tag("components/filter-singlefield.html")
def interviews_field(field):
    return {'field': field,
            'error_container': error_container_selector(field.name)}


@register.inclusion_tag("components/interviews-single.html")
def interview_single_component(field, request):
    user_datetime = to_user_timezone(field.interview_datetime, request.user)
    return {
        'name': field.candidate_name,
        'surname': field.candidate_surname,
        'position': field.interview_position,
        'date': user_datetime.date(),
        'time': user_datetime.time()
    }

@register.inclusion_tag("components/filter-datepickerField.html")
def datepicker_field(field, min='', max='', format='y-m-d'):
    return {
        'field': field,
        'min': min,
        'max': max,
        'format': format
    }


@register.inclusion_tag("components/filter-fileField.html")
def file_field(field, newLabel='Select File'):
    return {
        'field': field,
        'newLabel': newLabel,
        'error_container': error_container_selector(field.name + " ")
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