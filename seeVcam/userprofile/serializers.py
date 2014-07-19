from rest_framework import serializers
from authentication.models  import SeevcamUser

class UserprofileSerializer(serializers.ModelSerializer):

    class Meta:
        model = SeevcamUser
        fields = ('username','email','first_name','last_name','job_title')