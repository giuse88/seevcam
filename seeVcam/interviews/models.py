from django.db import models
from django.conf import settings


class Interview(models.Model):
    interview_owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)
    #Job spec
    #interview time


class Candidate(models.Model):
    #Candidate name
    #Candidate email
    #Candidate cv
    pass
