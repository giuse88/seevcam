import datetime
from django.http import HttpResponse
from django.views.decorators.cache import never_cache


@never_cache
def status(request):
    now = datetime.datetime.utcnow()
    html = "<html><body>STATUS <b>OK</b> <br> <br> UTC : %s</body></html>" % now
    return HttpResponse(html, status=200)
