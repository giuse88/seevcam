from django import template
register = template.Library()


@register.inclusion_tag("filter-singleField.html")
def interviews_field(field):
    return {'field': field}


@register.inclusion_tag("filter-datepickerField.html")
def datepicker_field(field):
    return {'field': field}


@register.inclusion_tag("filter-timepickerField.html")
def timepicker_field(field):
    return {'field': field}


@register.filter
def placeholder(value, text):
    value.field.widget.attrs["placeholder"] = text
    return value
