from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *

router = DefaultRouter()
router.register(r'law-categories', LawCategoryViewSet)
router.register(r'law-documents', LawDocumentViewSet)
router.register(r'law-articles', LawArticleViewSet)
router.register(r'legal-news', LegalNewsViewSet)
router.register(r'tags', TagViewSet)
router.register(r'user-queries', UserQueryViewSet)
router.register(r'query-intents', QueryIntentViewSet)
router.register(r'query-recommendations', QueryRecommendationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
