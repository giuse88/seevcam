from django.core.files.uploadedfile import SimpleUploadedFile
from authentication.models import SeevcamUser
from company_profile.models import Company
from interviews.models import Interview
from questions.models import QuestionCatalogue
from StringIO import StringIO

def create_interview_model():
    user_1 = create_dummy_user('user_1', 'password')
    file_path = "test-file/test-file.txt"
    interview = Interview(pk=1, interview_owner=user_1,
                          candidate_email="test@email.it",
                          candidate_name="name",
                          candidate_surname="surname",
                          candidate_cv=file_path,
                          interview_job_description=file_path,
                          interview_position="position",
                          interview_description="test",
                          interview_datetime="2014-12-23 11:30",
                          interview_duration=15,
                          interview_datetime_end="2014-12-23 11:45")
    interview.save()
    return interview


def create_dummy_user(email, company, password='test'):
    user = SeevcamUser.objects.create_user(email, password, company)
    user.save()
    return user


def create_dummy_company(name="company"):
    company = Company(name=name)
    company.save()
    return company


def create_dummy_catalogue(name, user):
    catalogue = QuestionCatalogue(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE,
                                  catalogue_name=name, catalogue_owner=user)
    catalogue.save()
    return catalogue


def create_upload_file(name="test.pdf", type='application/pdf'):
     raw_content = StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00'
                             '\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
     return SimpleUploadedFile(name, raw_content.read(), type)