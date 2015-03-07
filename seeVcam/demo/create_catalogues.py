import os
import yaml
from questions.models import QuestionCatalogue, Question

BASE = os.path.dirname(os.path.abspath(__file__))


def create_catalogue(name, user):
    return QuestionCatalogue.objects.create(
        catalogue_scope="PRIVATE",
        catalogue_name=name,
        catalogue_owner=user)


def create_question(question, cat):
    return Question.objects.create(
        question_text=question,
        question_catalogue=cat)


def populate_catalogs(user):
    document = open(os.path.join(BASE, 'fixtures/catalogs.yml'), 'r')
    catalogs_to_load = yaml.load(document)
    catalogues = []

    for catalogue, questions in catalogs_to_load.items():
        cat = create_catalogue(catalogue, user)
        catalogues.append(cat)
        for question in questions:
            create_question(question, cat)

    return catalogues


def create_catalogues(user):
    user.delete_catalogues()
    return populate_catalogs(user)
