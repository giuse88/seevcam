# settings.local.py
from .base import *
import yaml

from django.core.exceptions import ImproperlyConfigured

ENVIRONMENT = "STAGING"

ALLOWED_HOSTS = [
    'ec2-54-154-88-46.eu-west-1.compute.amazonaws.com',
    'staging.seevcam.com'
]

with open("../../../shared/secrets.yml", "r") as f:
    secrets = yaml.load(f.read())


def get_config(setting, secrets=secrets):
    try:
        return secrets[setting]
    except KeyError:
        error_msg = "Set the {0} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)


STATIC_ROOT = '/home/seevcam/app/seevcam/current/public/'
STATIC_URL = '/'
STATICFILES_DIRS = [

]

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_config("SECRET_KEY")

# PRODUCTION DATABASE
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': get_config("DB_NAME"),
        'USER': get_config("DB_USER"),
        'PASSWORD': get_config("DB_PASSWORD"),
        'HOST': get_config("DB_HOST"),
        'PORT': get_config("DB_PORT"),
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