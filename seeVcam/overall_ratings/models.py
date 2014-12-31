from django.core.exceptions import ValidationError
from django.db import models
from common.mixins.model import UpdateCreateTimeStamp
from interviews.models import Interview


class OverallRatingQuestion(models.Model):
    question = models.TextField(null=False, blank=False, db_column='overall_rating_question')

    class Meta:
        verbose_name = 'overall_rating_question'
        verbose_name_plural = 'overall_rating_questions'
        db_table = "overall_rating_questions"


# I don't like it to have a validation function which is not contained within the model where it is used
def validate_rating(value):
    if value < 1 or value > 5:
        raise ValidationError("Error : " + str(value) + " is a incorrect rating.")


class OverallRating(UpdateCreateTimeStamp):

    interview = models.ForeignKey(Interview, null=False, blank=False, db_column='interview_id')
    question = models.ForeignKey(OverallRatingQuestion, null=False, blank=False, db_column='question_id')
    rating = models.PositiveSmallIntegerField(validators=[validate_rating],
                                              null=True, blank=True, db_column='rating')

    class Meta:
        verbose_name = 'overall_ratings'
        verbose_name_plural = 'overall_ratings'
        db_table = "overall_rating"
