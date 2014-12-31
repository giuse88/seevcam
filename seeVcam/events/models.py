from common.mixins.model import UpdateCreateTimeStamp
from interviews.models import Interview
from django.db import models


class Event(UpdateCreateTimeStamp):

    RATE_CREATED = 'RATE_CREATED'
    RATE_UPDATED = 'RATE_UPDATE'
    ANSWER_UPDATED = 'ANSWER_UPDATED'
    ANSWER_CREATED = 'ANSWER_CREATE'
    QUESTION_SELECTED = 'QUESTION_SELECTED'

    TYPES = ((RATE_CREATED, RATE_CREATED),
             (RATE_UPDATED, RATE_UPDATED),
             (ANSWER_UPDATED, ANSWER_UPDATED),
             (ANSWER_CREATED, ANSWER_CREATED),
             (QUESTION_SELECTED, QUESTION_SELECTED))

    timestamp = models.DateTimeField(null=False, blank=False, db_column='timestamp')
    interview = models.ForeignKey(Interview, null=False, blank=False, db_column='interview_id')
    content = models.TextField(null=False, blank=False, default="{}", db_column='content')
    type = models.CharField(max_length=255, choices=TYPES, null=False, blank=False, db_column='type')

    class Meta:
        verbose_name = 'event'
        verbose_name_plural = 'events'
        db_table = "events"