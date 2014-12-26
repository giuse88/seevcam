from django.contrib import admin

from .models import QuestionCatalogue, Question


class QuestionCatalogueAdmin(admin.ModelAdmin):
    fields = ('catalogue_name',)

    def save_model(self, request, obj, form, change):
        obj.catalogue_owner = request.user
        obj.catalogue_scope = QuestionCatalogue.SEEVCAM_SCOPE
        obj.save()


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'question_catalogue',)


admin.site.register(QuestionCatalogue, QuestionCatalogueAdmin)
admin.site.register(Question, QuestionAdmin)
