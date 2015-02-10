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
    ('bootstrap/css', os.path.join(BASE_DIR, 'static/bower_components/bootstrap/dist/css/')),
    ('client/login', os.path.join(BASE_DIR, 'static/client/login/css/')),
    ('static/images/UI', os.path.join(BASE_DIR, 'static/images/UI/'))
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