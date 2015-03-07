from django.core.management.base import BaseCommand, CommandError
from authentication.models import SeevcamUser
from demo.create_demo import create_demo


class Command(BaseCommand):
    args = '<user_email, user_email ...>'
    help = 'Create demo data for the given user'

    def handle(self, *args, **options):
        for email in args:
            try:
                user = SeevcamUser.objects.get(email=email)
                self.stdout.write("Creating demo for user: " + str(user))
                create_demo(user)
            except SeevcamUser.DoesNotExist:
                raise CommandError('Seevcam user "%s" does not exist' % email)

            self.stdout.write('Successfully create demo for "%s"' % email)