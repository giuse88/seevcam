import datetime
import pytz
from django.conf import settings


# need to translate to a non-naive timezone, even if timezone == settings.TIME_ZONE, so we can compare two dates
def to_user_timezone(date, profile):
    print "Server date : " +  str(date)
    print "user timezone : " + profile.timezone
    print "Server timezone : " + settings.TIME_ZONE
    print date
    new_date=date.replace(tzinfo=pytz.timezone(settings.TIME_ZONE))
    print new_date
    new_date = new_date.astimezone(pytz.timezone(profile.timezone))
    print "User date " + str(new_date)
    print new_date
    return new_date


def to_system_timezone(date, profile):
    print "Local date : " +  str(date)
    print "user timezone : " + profile.timezone
    timezone = profile.timezone if profile.timezone else settings.TIME_ZONE
    print timezone
    new_date=date.astimezone(pytz.timezone(settings.TIME_ZONE))
    print "System date :  " + str(new_date)
    print "Server timezone : " + profile.timezone
    return new_date


def now_timezone():
    return datetime.datetime.now().replace(tzinfo=pytz.timezone(settings.TIME_ZONE)).astimezone(
        pytz.timezone(settings.TIME_ZONE))
