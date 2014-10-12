from authentication.models import SeevcamUser
from interviews.models import Interview
from questions.models import QuestionCatalogue

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


def create_dummy_user(username, password):
    user = SeevcamUser.objects.create_user(username, password=password)
    user.save()
    return user


def create_dummy_catalogue(name, user):
    catalogue = QuestionCatalogue(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE,
                                  catalogue_name=name, catalogue_owner=user)
    catalogue.save()
    return catalogue