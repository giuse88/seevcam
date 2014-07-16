from rest_framework import permissions
from models import QuestionCatalogue

class SeevcamPermissionHelper:

    @staticmethod
    def is_safe_request(request):
        if request.method in permissions.SAFE_METHODS:
            return True

    @staticmethod
    def is_safe_seevcam_scope_request(request):
        return ScopeHelper.is_seevcam_scope(request)\
            and SeevcamPermissionHelper.is_safe_request(request)


class ScopeHelper:

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

