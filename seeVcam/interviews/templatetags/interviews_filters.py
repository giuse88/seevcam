from django import template
register = template.Library()


@register.inclusion_tag("components/filter-singlefield.html")
def interviews_field(field):
    return {'field': field}

@register.inclusion_tag("components/interviews-single.html")
def interview_single_component(field):
    return {
        'name': field.candidate_name,
        'surname': field.candidate_surname,
        'position': field.interview_position,
        'date': field.interview_datetime.date(),
        'time': field.interview_datetime.time()
    }

@register.inclusion_tag("components/filter-datepickerField.html")
def datepicker_field(field, min='', max='', format='y-m-d'):
    return {
        'field': field,
        'min': min,
        'max': max,
        'format': format
    }


@register.inclusion_tag("components/filter-timepickerField.html")
def timepicker_field(field, min='', max=''):
    return {
        'field': field,
        'min': min,
        'max': max
    }


@register.inclusion_tag("components/filter-fileField.html")
def file_field(field, newLabel='Select File'):
    return {
        'field': field,
        'newLabel': newLabel
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