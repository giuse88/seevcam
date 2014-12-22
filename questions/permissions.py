from rest_framework import permissions

from questions.models import QuestionCatalogue
from helpers import ScopeHelper


class ReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        return False


class IsPrivateScope(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if ScopeHelper.is_private_scope(request):
            return True
        return False


class IsOwner(IsPrivateScope):

    def has_object_permission(self, request, view, obj):
        return obj.catalogue_owner == request.user


class IsCatalogueOwnerOrSeevcamScope(permissions.BasePermission):

    def has_permission(self, request, view):
        catalogue = QuestionCatalogue.objects.get(pk=view.kwargs['question_catalogue'])
        owner = catalogue.catalogue_owner
        return request.user == owner or catalogue.isSeevcamScope
