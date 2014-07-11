from django.db import models
from django.conf import settings


class QuestionCatalogue(models.Model):
    PRIVATE_SCOPE = 'PRIVATE'
    SEEVCAM_SCOPE = 'SEEVCAM'
    CATALOGUE_SCOPES = (
        (PRIVATE_SCOPE, 'Private'),
        (SEEVCAM_SCOPE, 'SeeVcam'),
    )
    catalogue_scope = models.CharField(max_length=255, choices=CATALOGUE_SCOPES, default=PRIVATE_SCOPE, null=False,
                                       blank=False)
    catalogue_name = models.CharField(max_length=255, null=False, blank=False)
    catalogue_owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    def __unicode__(self):
        return self.catalogue_name


class Question(models.Model):
    question_text = models.TextField(null=False, blank=False)
    question_catalogue = models.ForeignKey(QuestionCatalogue, null=False, blank=False)

    def __unicode__(self):
        return self.question_text
