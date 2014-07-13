from rest_framework import serializers

from models import QuestionCatalogue, Question


class QuestionCatalogueSerializer(serializers.ModelSerializer):

    @staticmethod
    def validate_catalogue_scope(attrs, source):
        """
        Check that the scope specified is one of the two values allowed
        """
        value = attrs[source]
        if value.upper() not in QuestionCatalogue.CATALOGUE_SCOPES:
            raise serializers.ValidationError("Invalid catalogue scope specified")
        return attrs

    class Meta:
        model = QuestionCatalogue
        fields = ('id', 'catalogue_scope', 'catalogue_name')


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'question_text', 'question_catalogue')

