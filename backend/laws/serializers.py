from rest_framework import serializers
from .models import (
    LawCategory, LawDocument, LawArticle,
    LegalNews, Tag, UserQuery, QueryIntent, QueryRecommendation
)

class LawCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LawCategory
        fields = '__all__'


class LawArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = LawArticle
        fields = '__all__'


class LawDocumentSerializer(serializers.ModelSerializer):
    articles = LawArticleSerializer(many=True, read_only=True)
    category = LawCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=LawCategory.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = LawDocument
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class LegalNewsSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = LegalNews
        fields = '__all__'


class UserQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuery
        fields = '__all__'

class QueryIntentSerializer(serializers.ModelSerializer):
    class Meta:
        model = QueryIntent
        fields = '__all__'

class QueryRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = QueryRecommendation
        fields = '__all__'