# settings.local.py
from .base import *
import json

from django.core.exceptions import ImproperlyConfigured


ENVIRONMENT = "PRODUCTION"

with open("secrets.json") as f:
    secrets = json.loads(f.read())


def get_config(setting, secrets=secrets):
    try:
        return secrets[setting]
    except KeyError:
        error_msg = "Set the {0} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_config("SECRET_KEY")

# PRODUCTION DATABASE
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'seeVcamDb',
        'USER': '',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

OPENTOK_API_KEY = get_config("OPENTOK_API_KEY")
OPENTOK_SECRET = get_config("OPENTOK_SECRET")

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = "email-smtp.eu-west-1.amazonaws.com"
EMAIL_PORT = "25"
EMAIL_HOST_USER = get_config("SMTP_USER")
EMAIL_HOST_PASSWORD = get_config("SMTP_PWD")
EMAIL_USE_TLS = True
