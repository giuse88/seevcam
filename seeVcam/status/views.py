from django.http import HttpResponse
from django.views.decorators.cache import never_cache


@never_cache
def status(request):
    return HttpResponse("STATUS OK", status=200)
