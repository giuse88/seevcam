from __future__ import unicode_literals

import pytz
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

from django_countries.fields import CountryField
from django.utils import timezone
from django.core.mail import send_mail
from django.db import models
from django.utils.http import urlquote
from django.utils.translation import ugettext_lazy as _

from company_profile.models import Company
from file_upload_service.models import UploadedFile
from interviews.models import Candidate, JobPosition, Interview
from questions.models import QuestionCatalogue
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
    email = models.EmailField(_('email address'), max_length=254, unique=True, db_index=True)

    first_name = models.CharField(_('first name'), max_length=30, blank=False, null=False)
    last_name = models.CharField(_('last name'), max_length=30, blank=False, null=False)
    is_staff = models.BooleanField(_('staff status'), default=False,
                                   help_text=_('Designates whether the user can log into this admin site.'))
    is_active = models.BooleanField(_('active'), default=True,
                                    help_text=_('Designates whether this user should be treated as active. '
                                                'Unselect this instead of deleting accounts.'))
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    country = CountryField(default='GB')
    timezone = models.CharField(max_length=255, null=False, blank=False, choices=TIMEZONE_CHOICES,
                                default='Europe/London')
    notifications = models.OneToOneField(UserNotifications, null=False, blank=False,
                                         related_name="user_notification_settings")
    company = models.ForeignKey(Company, null=False, blank=False, related_name="user_company")

    objects = SeevcamUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = "users"
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.get_full_name()

    def save(self, *args, **kwargs):
        if not self.notifications_id:
            notifications = UserNotifications()
            notifications.save()
            self.notifications = notifications
            self.notifications_id = notifications.id
        super(SeevcamUser, self).save(*args, **kwargs)

    def delete(self, using=None):
        if self.notifications:
            self.notifications.delete()
        super(SeevcamUser, self).delete(using)

    def get_absolute_url(self):
        return "/users/%s/" % urlquote(self.get_full_name())

    def get_full_name(self):
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        return self.first_name

    def email_user(self, subject, message, from_email=None):
        send_mail(subject, message, from_email, [self.email])

    def delete_uploaded_files(self):
        UploadedFile.objects.filter(created_by=self).delete()

    def delete_catalogues(self):
        QuestionCatalogue.objects.filter(catalogue_owner=self).delete()

    def delete_candidates(self):
        Candidate.objects.filter(created_by=self).delete()

    def delete_job_positions(self):
        JobPosition.objects.filter(created_by=self).delete()

    def delete_interviews(self):
        Interview.objects.filter(owner=self, status=Interview.OPEN).delete()

    def delete_reports(self):
        Interview.objects.filter(owner=self, status=Interview.CLOSED).delete()



