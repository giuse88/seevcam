from django.contrib import admin
from interviews.models import Interview, Candidate, JobPosition


class CandidateAdmin(admin.ModelAdmin):
    fields = ('name', 'surname', 'email', 'cv')
    list_display = ('id',) + fields


class JobPositionAdmin(admin.ModelAdmin):
    fields = ('position', 'job_description')
    list_display = ('id',) + fields


class InterviewAdmin(admin.ModelAdmin):
    fields = ('status', 'start', 'end', 'catalogue', 'owner', 'job_position', 'candidate',
              'session_id', 'token', 'overall_score')
    list_display = ('id',) + fields

admin.site.register(Interview, InterviewAdmin)
admin.site.register(Candidate, CandidateAdmin)
admin.site.register(JobPosition, JobPositionAdmin)


