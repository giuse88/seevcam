import pytz

from django.utils import timezone

class TimezoneMiddleware(object):

    def process_request(self, request):
        tzname = request.user.timezone
        print tzname
        if tzname:
            timezone.activate(pytz.timezone(tzname))
        else:
            timezone.deactivate()
