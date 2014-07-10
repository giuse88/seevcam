from django.db import models
from django.conf import settings

class QuestionCatalogue(models.Model):
    catalogue_scope = models.CharField(max_length=255, null=True, blank=False)
    catalogue_name = models.CharField(max_length=255, null=False, blank=False)
    catalogue_owner = models.ForeignKey(settings.AUTH_USER_MODEL)

    def __unicode__(self):
        return self.catalogue_name


class Question(models.Model):
    question_text = models.TextField()
    question_catalogue = models.ForeignKey(QuestionCatalogue)

    def __unicode__(self):
        return self.question_text
