"""
Django settings for seeVcam project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import json
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
#JSON secret module
with open("secrets.json") as f:
    secrets = json.loads(f.read())


def get_secret(setting, secrets=secrets):
    try:
        return secrets[setting]
    except KeyError:
        error_msg = "Set the {0} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_secret("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!

ALLOWED_HOSTS = []


# Application definition

DEFAULT_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # The Django sites framework is required by allauth
    'django.contrib.sites',
)
THIRD_PARTY_APPS = (
    # DB migration
    'south',
    # allauth
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
)
LOCAL_APPS = (
    'login',

)

INSTALLED_APPS = DEFAULT_APPS + THIRD_PARTY_APPS + LOCAL_APPS


TEMPLATE_CONTEXT_PROCESSORS = (
# Required by allauth template tags
"django.core.context_processors.request",
# allauth specific context processors
"allauth.account.context_processors.account",
"allauth.socialaccount.context_processors.socialaccount",
'django.contrib.auth.context_processors.auth',
)

AUTHENTICATION_BACKENDS = (
# Needed to login by username in Django admin, regardless of `allauth`
"django.contrib.auth.backends.ModelBackend",

# `allauth` specific authentication methods, such as login by e-mail
"allauth.account.auth_backends.AuthenticationBackend",
)



SITE_ID = 1

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'seeVcam.urls'

WSGI_APPLICATION = 'seeVcam.wsgi.application'


# Auth
AUTH_USER_MODEL = 'login.SeevUser'

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'
