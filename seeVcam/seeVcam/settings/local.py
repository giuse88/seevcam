# settings.local.py
from .base import *

# Debug options
DEBUG = True

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }

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
# allauth settings

# Determines whether or not an e-mail address is automatically confirmed by a mere GET request. default(=False)
ACCOUNT_CONFIRM_EMAIL_ON_GET= True