import pytz

from django.utils import timezone
from authentication.models import SeevcamUser
from django.conf import settings

class TimezoneMiddleware(object):

    def process_request(self, request):
        if isinstance(request.user, SeevcamUser):
            tzname = request.user.timezone
        else:
            tzname = settings.TIME_ZONE

        if tzname:
            timezone.activate(pytz.timezone(tzname))
        else:
            timezone.deactivate()
