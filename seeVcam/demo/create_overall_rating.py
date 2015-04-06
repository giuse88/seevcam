import random
from overall_ratings.models import OverallRating


def create_overall_rating(report):
    for overall_rating in OverallRating.objects.filter(interview=report):
        overall_rating.rating = random.randint(1, 5)
        overall_rating.save()


def create_overall_ratings(reports, populate=False):
    for report in reports:
        report.create_overall_ratings()
        if populate:
            create_overall_rating(report)
