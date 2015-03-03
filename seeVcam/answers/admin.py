from django.contrib import admin
from .models import Answer


class AnswerAdmin(admin.ModelAdmin):
    fields = ('question', 'content', 'rating', 'interview')
    list_display = ('id',) + fields

admin.site.register(Answer, AnswerAdmin)

