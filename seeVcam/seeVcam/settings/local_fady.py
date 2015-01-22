# settings.local.py
from .base import *

# Debug options
DEBUG = True
ALLOWED_HOSTS = ['localhost']

TEMPLATE_DEBUG = True

SECRET_KEY = 'locale_fake_key^8m2v$*7^9qp$4z6r2%3o8w34gox3u)^^%4%fe1*@'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'seevcamdb',
        'USER': 'seevcam',
        'PASSWORD': 'seevcam',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

ACCOUNT_CONFIRM_EMAIL_ON_GET = True