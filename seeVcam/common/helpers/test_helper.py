import datetime

from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
import pytz

from answers.models import Answer
from authentication.models import SeevcamUser
from company_profile.models import Company
from interviews.models import Interview, Candidate, JobPosition
from file_upload_service.models import UploadedFile
from notes.models import Notes
from overall_ratings.models import OverallRatingQuestion, OverallRating
from questions.models import QuestionCatalogue, Question


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
    binary_content = b"some initial binary data: \x00\x01"
    return SimpleUploadedFile(name, binary_content, file_type)


def create_uploaded_file(user, file=create_file(), type="cv"):
    uploaded_file = UploadedFile.objects.create_uploaded_file(file, user, type)
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


def create_answer(interview, question, content="This is an answer", rating=None):
    answer = Answer(interview=interview, question=question, content=content, rating=rating)
    answer.save()
    return answer


def create_notes(content="notes test"):
    notes = Notes(content=content)
    notes.save()
    return notes


def create_overall_rating_question(question="this is a question for overall rating"):
    overall_question = OverallRatingQuestion(question=question)
    overall_question.save()
    return overall_question


def create_overall_rating(interview, question):
    overall_question = OverallRating(question=question, interview=interview, rating=1)
    overall_question.save()
    return overall_question


def create_interview(user, catalogue, candidate, job_position,
                     start='2015-05-04T12:20:34.000343+00:00',
                     end='2015-05-04T13:20:34.000343+00:00',
                     status=Interview.OPEN
                     ):
    interview = Interview(status=status,
                          start=start,
                          end=end,
                          catalogue=catalogue,
                          owner=user,
                          candidate=candidate,
                          job_position=job_position)
    interview.save()
    return interview


def string_to_datetime(datetime_str):
    d = datetime.datetime.strptime(datetime_str, settings.DATE_INPUT_FORMATS[0])
    return pytz.utc.localize(d)


def login_user(client, email="test@test.com", password='test'):
    client.post(settings.LOGIN_URL, {'username': email, 'password': password})

