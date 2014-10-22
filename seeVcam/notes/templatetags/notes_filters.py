from django import template
register = template.Library()
from random import randint

@register.inclusion_tag("components/questions-single.html")
def notes_single_question(field,request):

    rating = randint(0,100)

    if rating<50:
        color = 'red'
        progress_class = 'danger'
    elif rating<70:
        color = 'yellow'
        progress_class = 'warning'
    else:
        color = 'green'
        progress_class = 'success'

    return {
        'question': field.question,
        'answer': field.answer,
        'rating': rating,
        'color': color,
        'progress_class': progress_class,
    }