from django.contrib import admin
from .models import OverallRatingQuestion


class OverallRatingQuestionAdmin(admin.ModelAdmin):
    fields = ('question',)
    list_display = ('id', 'question')

admin.site.register(OverallRatingQuestion, OverallRatingQuestionAdmin)
