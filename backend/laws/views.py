from django.shortcuts import render
from rest_framework import viewsets
from .models import (
    LawCategory, LawDocument, LawArticle,
    LegalNews, Tag, UserQuery, QueryIntent, QueryRecommendation
)
from .serializers import (
    LawCategorySerializer, LawDocumentSerializer, LawArticleSerializer,
    LegalNewsSerializer, TagSerializer, UserQuerySerializer, QueryIntentSerializer, QueryRecommendationSerializer
)

class LawCategoryViewSet(viewsets.ModelViewSet):
    queryset = LawCategory.objects.all()
    serializer_class = LawCategorySerializer


class LawDocumentViewSet(viewsets.ModelViewSet):
    queryset = LawDocument.objects.all().order_by('-issued_date')
    serializer_class = LawDocumentSerializer


class LawArticleViewSet(viewsets.ModelViewSet):
    queryset = LawArticle.objects.all().order_by('order')
    serializer_class = LawArticleSerializer


class LegalNewsViewSet(viewsets.ModelViewSet):
    queryset = LegalNews.objects.all().order_by('-publish_date')
    serializer_class = LegalNewsSerializer


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class UserQueryViewSet(viewsets.ModelViewSet):
    queryset = UserQuery.objects.all()
    serializer_class = UserQuerySerializer

class QueryIntentViewSet(viewsets.ModelViewSet):
    queryset = QueryIntent.objects.all()
    serializer_class = QueryIntentSerializer

class QueryRecommendationViewSet(viewsets.ModelViewSet):
    queryset = QueryRecommendation.objects.all()
    serializer_class = QueryRecommendationSerializer
