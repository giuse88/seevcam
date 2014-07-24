from django.forms import ModelForm
from authentication.models import SeevcamUser


class UserprofileForm(ModelForm):


    class Meta:
        model = SeevcamUser
        fields = ['username', 'email', 'first_name', 'last_name', 'job_title', 'pic']