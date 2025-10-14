from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    LawCategoryViewSet, LawDocumentViewSet, LawArticleViewSet,
    LegalNewsViewSet, TagViewSet,
    UserQueryViewSet, QueryIntentViewSet, QueryRecommendationViewSet, LegalConsultationViewSet, UserConsultationViewSet,
    list_documents, document_detail, user_history, NotificationListView, MarkNotificationAsReadView, MarkAllAsReadView
)

router = DefaultRouter()
router.register(r'law-categories', LawCategoryViewSet)
router.register(r'law-documents', LawDocumentViewSet)
router.register(r'law-articles', LawArticleViewSet)
router.register(r'legal-news', LegalNewsViewSet)
router.register(r'tags', TagViewSet)
router.register(r'user-queries', UserQueryViewSet)
router.register(r'query-intents', QueryIntentViewSet)
router.register(r'query-recommendations', QueryRecommendationViewSet)
router.register(r'consultations', LegalConsultationViewSet, basename='consultation')
router.register(r"my-consultations", UserConsultationViewSet, basename="my-consultations")

urlpatterns = [
    path('', include(router.urls)),

    path('law-documents/', list_documents, name='documents-list'),
    path('law-documents/<int:pk>/detail/', document_detail, name='documents-detail'),
    path('user-history/', user_history, name='user-history'),
    path("notifications/", NotificationListView.as_view(), name="notifications"),
    path("notifications/<int:pk>/read/", MarkNotificationAsReadView.as_view(), name="notification-read"),
    path("notifications/mark-all/", MarkAllAsReadView.as_view(), name="notifications-mark-all"),
]
