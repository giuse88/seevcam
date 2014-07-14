# settings.local.py
from .base import *

# Debug options
DEBUG = True

TEMPLATE_DEBUG = True

SECRET_KEY = 'locale_fake_key^8m2v$*7^9qp$4z6r2%3o8w34gox3u)^^%4%fe1*@'

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

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

ACCOUNT_CONFIRM_EMAIL_ON_GET = True