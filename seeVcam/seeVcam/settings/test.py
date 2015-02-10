""" Test settings and globals which
    allow us to run our test suite
    locally.
"""

# settings.local.py
from .base import *

ENVIRONMENT = "TEST"

SECRET_KEY = 'test_key_p^8m2v$*7^9qp$4z6r2%3o8w34gox3u)^^%4%fe1*@'

OPENTOK_API_KEY = '45119972'

OPENTOK_SECRET = '5efd4d4019183140d4b34a40477732babbf56c45'

# Debug options
DEBUG = True

########## MEMORY DATABASE FOR TESTING PURPOSES
DATABASES= {
      "default": {
          "ENGINE": "django.db.backends.sqlite3",
          "NAME": ":memory:",
          "USER": "",
          "PASSWORD": "",
          "HOST": "",
          "PORT": "",
      },
}