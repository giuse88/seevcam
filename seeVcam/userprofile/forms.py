from django.forms import ModelForm
from authentication.models import SeevcamUser


class UserprofileForm(ModelForm):
    class Meta:
        model = SeevcamUser
        fields = ['username','job_title']