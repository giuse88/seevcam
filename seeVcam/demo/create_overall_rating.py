import random
from overall_ratings.models import OverallRating


def create_overall_rating(report):
    for overall_rating in OverallRating.objects.filter(interview=report):
        overall_rating.rating = random.randint(1, 5)


def create_overall_ratings(reports):
    for report in reports:
        report.create_overall_ratings()
        create_overall_rating(report)
