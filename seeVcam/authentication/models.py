from __future__ import unicode_literals
import warnings

import pytz

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Doesn't exist anymore in django 1.7
try:
    from django.contrib.auth.models import SiteProfileNotAvailable
except ImportError:
    # Dummy exception to keep the handling below identical
    SiteProfileNotAvailable = ImportError

from django_countries.fields import CountryField
from django.utils import timezone
from django.core.exceptions import ImproperlyConfigured
from django.core.mail import send_mail
from django.db import models
from django.utils.http import urlquote
from django.utils.translation import ugettext_lazy as _

from company_profile.models import Company
from userprofile.models import UserNotifications

TIMEZONE_CHOICES = [(tz, tz) for tz in pytz.all_timezones]


class SeevcamUserManager(BaseUserManager):
    def _create_user(self, email, password, company,
                     is_staff, is_superuser, country='GB',
                     user_timezone='Europe/London', **extra_fields):

        if not email:
            raise ValueError('Users must have an email address')

        now = timezone.now()
        email = self.normalize_email(email)
        notifications = UserNotifications()
        notifications.save()
        user = self.model(email=email,
                          is_staff=is_staff, is_active=True,
                          is_superuser=is_superuser, last_login=now,
                          date_joined=now, company=company, notifications=notifications,
                          country=country, timezone=user_timezone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, company,
                    country='GB', user_timezone='Europe/London',
                    **extra_fields):

        if not company:
            raise ValueError('Users must belong to a company')

        return self._create_user(email, password, company, False, False, country, user_timezone, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        company, created = Company.objects.get_or_create(name="seevcam")
        return self._create_user(email, password, company, True, True,
                                 **extra_fields)


class SeevcamUser(AbstractBaseUser, PermissionsMixin):
    """
    Seevcam awesome user model
    """
    # User identifier
    email = models.EmailField(_('email address'), max_length=254, unique=True, db_index=True)

    # User information
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    is_staff = models.BooleanField(_('staff status'), default=False,
                                   help_text=_('Designates whether the user can log into this admin '
                                               'site.'))
    is_active = models.BooleanField(_('active'), default=True,
                                    help_text=_('Designates whether this user should be treated as '
                                                'active. Unselect this instead of deleting accounts.'))
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    # Location information
    country = CountryField()
    timezone = models.CharField(max_length=255, null=False, blank=False, choices=TIMEZONE_CHOICES,
                                default='Europe/London')
    # link to external object
    notifications = models.ForeignKey(UserNotifications, null=False, blank=False,
                                      related_name="user_notification_settings")
    company = models.ForeignKey(Company, null=False, blank=False, related_name="user_company")

    objects = SeevcamUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.get_full_name()

    class Meta:
        db_table = "users"
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_absolute_url(self):
        return "/users/%s/" % urlquote(self.username)

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """
        Returns the short name for the user
        """
        return self.first_name

    def email_user(self, subject, message, from_email=None):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email])

    def get_profile(self):
        """
        Returns site-specific profile for this user. Raises
        SiteProfileNotAvailable if this site does not allow profiles.
        """
        warnings.warn("The use of AUTH_PROFILE_MODULE to define user profiles has been deprecated.",
                      DeprecationWarning, stacklevel=2)
        if not hasattr(self, '_profile_cache'):
            from django.conf import settings

            if not getattr(settings, 'AUTH_PROFILE_MODULE', False):
                raise SiteProfileNotAvailable(
                    'You need to set AUTH_PROFILE_MODULE in your project '
                    'settings')
            try:
                app_label, model_name = settings.AUTH_PROFILE_MODULE.split('.')
            except ValueError:
                raise SiteProfileNotAvailable(
                    'app_label and model_name should be separated by a dot in '
                    'the AUTH_PROFILE_MODULE setting')
            try:
                model = models.get_model(app_label, model_name)
                if model is None:
                    raise SiteProfileNotAvailable(
                        'Unable to load the profile model, check '
                        'AUTH_PROFILE_MODULE in your project settings')
                self._profile_cache = model._default_manager.using(
                    self._state.db).get(user__id__exact=self.id)
                self._profile_cache.user = self
            except (ImportError, ImproperlyConfigured):
                raise SiteProfileNotAvailable
        return self._profile_cache

