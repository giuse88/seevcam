from django import template
from questions.models import Question

register = template.Library()


@register.inclusion_tag("components/single-catalogue.html")
def catalogue_single_component(field):
    catalog_class = 'catalog-red'
    if field.catalogue_scope == "PRIVATE":
        catalog_class = 'catalog-blue'
    return {
            'id': field.id,
            'name': field.catalogue_name,
            'scope': field.catalogue_scope.lower(),
            'catalogue_class': catalog_class,
            'number_of_questions': Question.objects.filter(question_catalogue=field.id).count()
            }