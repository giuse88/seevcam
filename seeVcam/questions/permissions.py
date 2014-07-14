from rest_framework import permissions

# class IsAdminOrReadOnly(permissions.BasePermission):
#     """
#     Custom permission to only allow owners of an object to edit it.
#     """
#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         return obj.owner == request.user
from questions.models import QuestionCatalogue


class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.catalogue_owner == request.user


#not good solution. Additional query that can be removed
class IsCatalogueOwner(permissions.BasePermission):

    def has_permission(self, request, view):
        owner = QuestionCatalogue.objects.get(pk=view.kwargs['question_catalogue']).catalogue_owner
        return request.user == owner
