from django.contrib import admin
from .models import OverallRatingQuestion


class OverallRatingQuestionAdmin(admin.ModelAdmin):
    fields = ('id', 'question')

admin.site.register(OverallRatingQuestion, OverallRatingQuestionAdmin)
