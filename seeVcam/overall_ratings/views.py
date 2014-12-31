from rest_framework.generics import ListAPIView, UpdateAPIView
from overall_ratings.models import OverallRating
from overall_ratings.serializer import OverallRatingSerializer


class ListOverviewRatting(ListAPIView):
    serializer_class = OverallRatingSerializer
    model = OverallRating

    def get_queryset(self):
        return OverallRating.objects.filter(interview=self.kwargs['interview_id'])


class UpdateOverviewRatting(UpdateAPIView):
    serializer_class = OverallRatingSerializer
    model = OverallRating

    def pre_save(self, obj):
        obj.interview_id = self.kwargs['interview_id']

    def get_queryset(self):
        return OverallRating.objects.filter(interview=self.kwargs['interview_id'],
                                            pk=self.kwargs['pk'])
