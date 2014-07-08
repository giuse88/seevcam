"""
Django settings for seeVcam project.
"""

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

ALLOWED_HOSTS = []

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
    # allauth applications
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
)
LOCAL_APPS = (
    'login',
    'interviews',
    'questions',

)

INSTALLED_APPS = DEFAULT_APPS + LOCAL_APPS + THIRD_PARTY_APPS

TEMPLATE_CONTEXT_PROCESSORS = (
    # Required by allauth template tags
    "django.core.context_processors.request",
    'django.contrib.auth.context_processors.auth',
    # allauth specific context processors
    "allauth.account.context_processors.account",
    "allauth.socialaccount.context_processors.socialaccount",
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

AUTH_USER_MODEL = 'login.SeevUser'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = os.path.join(BASE_DIR, '/assets/')

STATIC_PATH = os.path.join(BASE_DIR,    'static')
ASSETS_PATH = os.path.join(BASE_DIR,    'assets')
TEMPLATE_PATH = os.path.join(BASE_DIR,  'templates')

STATICFILES_DIRS = (
    STATIC_PATH,
    ASSETS_PATH,
)
TEMPLATE_DIRS = (
    TEMPLATE_PATH,
)

# allauth settings
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_USERNAME_MIN_LENGTH = 3
ACCOUNT_PASSWORD_MIN_LENGTH = 8
