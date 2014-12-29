from django.core.exceptions import ValidationError
from django.db import models
from common.mixins.model import UpdateCreateTimeStamp, CompanyInfo

from interviews.models import Interview
from questions.models import Question


def validate_rating(value):
    if value < 1 or value > 10:
        raise ValidationError("Error : " + str(value) + " is a incorrect rating.")


class Answer(UpdateCreateTimeStamp):
    content = models.TextField(null=True, blank=True, db_column='content')
    rating = models.PositiveSmallIntegerField(validators=[validate_rating], null=True, blank=True, db_column='rating')
    question = models.ForeignKey(Question, null=False, blank=False, db_column='question_id')
    interview = models.ForeignKey(Interview, null=False, blank=False, db_column='interview_id')

    class Meta:
        verbose_name = 'answer'
        verbose_name_plural = 'answers'
        db_table = "answers"
