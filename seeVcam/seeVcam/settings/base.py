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
    'django.contrib.sites',
)
THIRD_PARTY_APPS = (
    'rest_framework',
    'easy_pjax',
    'django_countries',
    'widget_tweaks'
)

LOCAL_APPS = (
    'common',
    'interviews',
    'questions',
    'authentication',
    'dashboard',
    'userprofile',
    'interview_room',
    'company_profile',
    'answers',
    'overall_ratings',
    'file_upload_service',
    'demo',
    'notes',
    'events',
    'reports'
)

INSTALLED_APPS = DEFAULT_APPS + LOCAL_APPS + THIRD_PARTY_APPS

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.core.context_processors.request",
    'django.contrib.auth.context_processors.auth',
    "django.core.context_processors.media",
)

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
)

SITE_ID = 1

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'common.middleware.timezone.TimezoneMiddleware',
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

ROOT_URLCONF = 'seeVcam.urls'

WSGI_APPLICATION = 'seeVcam.wsgi.application'

AUTH_USER_MODEL = 'authentication.SeevcamUser'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

#only iso 8601, accept only utc timezone
DATE_INPUT_FORMATS = ['%Y-%m-%dT%H:%M:%S.%f%z', ]

DASHBOARD_URL = '/dashboard/'
LOGIN_URL = '/'
LOGIN_REDIRECT_URL = DASHBOARD_URL
LOGOUT_URL = DASHBOARD_URL + 'logout'

TEMPLATE_PATH = os.path.join(BASE_DIR, 'templates')
STATIC_PATH = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    STATIC_PATH,
)

TEMPLATE_DIRS = (
    TEMPLATE_PATH,
    os.path.join(BASE_DIR, 'questions/templates'),
    os.path.join(BASE_DIR, 'dashboard/templates'),
    os.path.join(BASE_DIR, 'reports/templates'),
    os.path.join(BASE_DIR, 'userprofile/templates'),
    os.path.join(BASE_DIR, 'interviews/templates'),
    os.path.join(BASE_DIR, 'notes/templates'),
    os.path.join(BASE_DIR, 'interview_room/templates'),
)

# allauth settings
LOG_FOLDER = os.path.join(BASE_DIR, 'log')

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

SEEVCAM_UPLOAD_FILE_MIME_TYPES = [
    'application/pdf',  # PDF
    'application/vnd.oasis.opendocument.text',  #WORD
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  #WORD
    'application/msword',  #WORD
]

SEEVCAM_UPLOAD_FILE_MAX_SIZE = "2097152"  # 2MB
SEEVCAM_UPLOAD_FILE_FOLDER = 'uploaded_files'
SEEVCAM_UPLOAD_FILE_FOLDER_URL = os.path.join(MEDIA_URL, 'uploaded_files')
APPEND_SLASH = True
ENVIRONMENT = "DEVELOPMENT"
#Interview configuration :
INTERVIEW_OPEN = 900  # 15 minutes
INTERVIEW_CLOSE = 900 # 15 minutes
# do we still use it?
INTERVIEW_TEMPORAL_WINDOW = 900  # 15 minutes
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
#Interview configuration :
INTERVIEW_OPEN = 900  # 15 minutes
INTERVIEW_CLOSE = 900 # 15 minutes
