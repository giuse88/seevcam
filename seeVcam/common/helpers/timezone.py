import datetime
import logging

import pytz
from django.conf import settings


def to_user_timezone(date, profile):
    logging.info('Server datetime: ' + str(date))
    new_date = date.replace(tzinfo=pytz.timezone(settings.TIME_ZONE))
    new_date = new_date.astimezone(pytz.timezone(profile.timezone))
    logging.info('User datetime: ' + str(new_date))
    return new_date


def to_system_timezone(date, profile):
    logging.info('User datetime: ' + str(date))
    logging.info('User timezone : ' + profile.timezone)
    timezone = profile.timezone if profile.timezone else settings.TIME_ZONE
    new_date = date.astimezone(pytz.timezone(settings.TIME_ZONE))
    logging.info('Server datetime: ' + str(new_date))
    return new_date


def now_timezone():
    return datetime.datetime.now().replace(tzinfo=pytz.timezone(settings.TIME_ZONE)).astimezone(
        pytz.timezone(settings.TIME_ZONE))
