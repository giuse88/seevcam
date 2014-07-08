# settings.local.py
from .base import *

# Debug options
DEBUG = True

SECRET_KEY = 'locale_fake_key^8m2v$*7^9qp$4z6r2%3o8w34gox3u)^^%4%fe1*@'

TEMPLATE_DEBUG = True

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

INSTALLED_APPS += ("debug_toolbar",)

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Determines whether or not an e-mail address is automatically confirmed by a mere GET request. default(=False)
ACCOUNT_CONFIRM_EMAIL_ON_GET= True