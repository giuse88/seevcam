from StringIO import StringIO

from django.core.files.uploadedfile import SimpleUploadedFile

from authentication.models import SeevcamUser
from company_profile.models import Company
from interviews.models import Interview, Candidate, JobPosition
from questions.models import QuestionCatalogue, Question
from file_upload.models import UploadedFile


def create_user(company, email="test@test.com", password='test'):
    user = SeevcamUser.objects.create_user(email, password, company)
    user.save()
    return user


def create_company(name="test company"):
    company = Company(name=name)
    company.save()
    return company


def create_catalogue(user, catalogue_name="test catalogue"):
    catalogue = QuestionCatalogue(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE,
                                  catalogue_name=catalogue_name, catalogue_owner=user)
    catalogue.save()
    return catalogue


def create_question(catalogue, text="test question"):
    question = Question(question_catalogue=catalogue, question_text=text)
    question.save()
    return question


def create_file(name="test.pdf", file_type='application/pdf'):
    raw_content = StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,' +
                           '\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
    return SimpleUploadedFile(name, raw_content.read(), file_type)


def create_uploaded_file(user):
    uploaded_file = UploadedFile.objects.create_uploaded_file(create_file(), user)
    uploaded_file.save()
    return uploaded_file


def create_candidate(user, company, cv, name="candidate name", surname="candidate surname", email="candidate email"):
    candidate = Candidate(created_by=user, company=company, name=name, surname=surname, email=email, cv=cv)
    candidate.save()
    return candidate


def create_job_position(user, company, job_description, position="test position"):
    job_position = JobPosition(position=position, company=company, created_by=user, job_description=job_description)
    job_position.save()
    return job_position


def create_interview(user, catalogue, candidate, job_position):
    interview = Interview(status=Interview.OPEN, start='2014-12-23 11:30', end='2014-12-23 12:00', duration=30,
                          catalogue=catalogue, owner=user, candidate=candidate, job_position=job_position)
    interview.save()
    return interview