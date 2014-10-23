from django.db import models
from django.conf import settings


class QuestionCatalogue(models.Model):
    #todo new status
    PRIVATE_SCOPE = 'PRIVATE'
    SEEVCAM_SCOPE = 'SEEVCAM'
    ANONYMOUS_SCOPE = 'ANONYMOUS'
    CATALOGUE_SCOPES = (
        (PRIVATE_SCOPE, 'private'),
        (SEEVCAM_SCOPE, 'seevcam'),
        (ANONYMOUS_SCOPE, 'anonymous'),
    )
    catalogue_scope = models.CharField(max_length=255, choices=CATALOGUE_SCOPES, default=PRIVATE_SCOPE, null=False,
                                       blank=False)
    catalogue_name = models.CharField(max_length=255, null=False, blank=False)
    catalogue_owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    def size(self):
        return Question.objects.filter(question_catalogue=self.id).count();

    def __unicode__(self):
        return self.catalogue_name


class Question(models.Model):
    question_text = models.TextField(null=False, blank=False)
    question_catalogue = models.ForeignKey(QuestionCatalogue, null=False, blank=False)

    def __unicode__(self):
        return self.question_text
