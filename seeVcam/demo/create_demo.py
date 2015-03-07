import os

import yaml

from questions.models import QuestionCatalogue, Question
from .uploaded_files import file_upload


BASE = os.path.dirname(os.path.abspath(__file__))


def create_catalogues(user):
    user.delete_catalogue()
    return populate_catalogs(user)


def populate_catalogs(user):
    document = open(os.path.join(BASE, 'fixtures/catalogues.yml'), 'r')
    catalogs_to_load = yaml.load(document)
    catalogues = []

    for catalogue, questions in catalogs_to_load.items():

        cat = QuestionCatalogue.objects.create(
            catalogue_scope="PRIVATE",
            catalogue_name=catalogue,
            catalogue_owner=user)
        catalogues.append(cat)

        for question in questions:
            Question.objects.create(
                question_text=question,
                question_catalogue=cat)

    return catalogues


def create_demo(user):
    cv, job = file_upload(user)
    catalogues = create_catalogues(user)


