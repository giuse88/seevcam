from rest_framework import permissions

from models import QuestionCatalogue


class SeevcamPermissionHelper(object):
    @staticmethod
    def is_safe_request(request):
        if request.method in permissions.SAFE_METHODS:
            return True

    @staticmethod
    def is_safe_seevcam_scope_request(request):
        return ScopeHelper.is_seevcam_scope(request)\
            and SeevcamPermissionHelper.is_safe_request(request)


class ScopeHelper(object):

    @staticmethod
    def is_seevcam_scope(request):
        scope = request.GET.get('scope', QuestionCatalogue.PRIVATE_SCOPE)
        scope = scope.upper()
        return scope == QuestionCatalogue.SEEVCAM_SCOPE

    @staticmethod
    def is_private_scope(request):
        scope = request.GET.get('scope', QuestionCatalogue.PRIVATE_SCOPE)
        scope = scope.upper()
        return scope == QuestionCatalogue.PRIVATE_SCOPE


class CatalogueQuerySetHelper(object):

    @staticmethod
    def user_catalogue_queryset(user_id):
        return QuestionCatalogue.objects.filter(catalogue_owner=user_id)

    @staticmethod
    def seevcam_catalogue_queryset():
        return QuestionCatalogue.objects.filter(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE)

    @staticmethod
    def user_catalogue_queryset_with_scope(user_id, scope):
        return QuestionCatalogue.objects.filter(catalogue_owner=user_id, catalogue_scope=scope)

    @staticmethod
    def get_first_catalogue_or_none(user_id):
        catalogues = CatalogueQuerySetHelper.user_catalogue_queryset(user_id)
        catalogue = list(catalogues[:1])
        if catalogue:
            return catalogue[0]
        return None