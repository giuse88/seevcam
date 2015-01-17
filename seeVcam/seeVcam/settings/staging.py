# settings.local.py
from .base import *
import yaml

from django.core.exceptions import ImproperlyConfigured

ENVIRONMENT = "STAGING"

ALLOWED_HOSTS = [
    'ec2-54-154-119-255.eu-west-1.compute.amazonaws.com',
]

with open("../../../shared/secrets.yml", "r") as f:
    secrets = yaml.load(f.read())


def get_secret(setting, secrets=secrets):
    try:
        return secrets[setting]
    except KeyError:
        error_msg = "Set the {0} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)


STATIC_ROOT = get_secret("STATIC_ROOT")
STATIC_URL = get_secret("STATIC_URL")
STATICFILES_DIRS = get_secret("STATICFILES_DIRS")

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_secret("SECRET_KEY")

# PRODUCTION DATABASE
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': get_secret("DB_NAME"),
        'USER': get_secret("DB_USER"),
        'PASSWORD': get_secret("DB_PASSWORD"),
        'HOST': get_secret("DB_HOST"),
        'PORT': get_secret("DB_PORT"),
    }
}