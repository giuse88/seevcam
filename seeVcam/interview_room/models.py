from django.db import models


class InterviewEvents(models.Model):
    class Meta:
        verbose_name = 'interview_event'
        verbose_name_plural = 'interview_events'
        db_table = "interview_events"


class InterviewVideo(models.Model):
    class Meta:
        verbose_name = 'interview_video'
        verbose_name_plural = 'interview_videos'
        db_table = "interview_videos"


class InterviewRatings(models.Model):
    class Meta:
        verbose_name = 'interview_ratings'
        verbose_name_plural = 'interview_ratings'
        db_table = "interview_ratings"
