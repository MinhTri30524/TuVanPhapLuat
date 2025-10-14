from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import viewsets, status, filters, permissions, generics
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from .crawler import crawl_document_detail
from .pagination import CustomPagination
from .models import (
    LawCategory, LawDocument, LawArticle,
    LegalNews, Tag, UserQuery, QueryIntent, QueryRecommendation, LawDocumentDetail, LegalConsultation,
    UserActivity, Notification
)
from .serializers import (
    LawCategorySerializer, LawArticleSerializer,
    LegalNewsSerializer, TagSerializer,
    UserQuerySerializer, QueryIntentSerializer, QueryRecommendationSerializer,
    LawDocumentListSerializer, LawDocumentDetailSerializer, LegalConsultationSerializer,
    UserActivitySerializer, NotificationSerializer
)


# --------- Danh mục ----------
class LawCategoryViewSet(viewsets.ModelViewSet):
    queryset = LawCategory.objects.all()
    serializer_class = LawCategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None


# --------- Văn bản ----------
class LawDocumentViewSet(viewsets.ModelViewSet):
    """
    API chính cho văn bản pháp luật.
    GET /law-documents/?search=thuế&category=1
    GET /law-documents/12/
    """
    queryset = LawDocument.objects.select_related("category").prefetch_related("articles")
    permission_classes = [AllowAny]
    pagination_class = CustomPagination
    # bật search/filter/order
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "code", "summary", "issued_by"]
    ordering_fields = ["issued_date", "created_at"]

    def get_serializer_class(self):
        return LawDocumentListSerializer if self.action == "list" else LawDocumentDetailSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """
        Ghi lại lịch sử khi người dùng xem chi tiết văn bản
        """
        instance = self.get_object()
        response = super().retrieve(request, *args, **kwargs)

        if request.user.is_authenticated:
            UserActivity.objects.create(
                user=request.user,
                activity_type="document",
                reference_id=str(instance.id),
                title=instance.title,
            )

        return response


# --------- Điều khoản ----------
class LawArticleViewSet(viewsets.ModelViewSet):
    queryset = LawArticle.objects.all().order_by("order")
    serializer_class = LawArticleSerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagination

class LegalConsultationViewSet(viewsets.ModelViewSet):
    queryset = LegalConsultation.objects.all()
    serializer_class = LegalConsultationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category"]
    search_fields = ["question_title", "answer"]
    ordering_fields = ["asked_date", "created_at"]
    ordering = ["-asked_date"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        consultation = serializer.save(user=self.request.user)
        # Ghi lịch sử khi người dùng gửi câu hỏi tư vấn
        UserActivity.objects.create(
            user=self.request.user,
            activity_type="question",
            reference_id=str(consultation.id),
            title=consultation.question_title,
        )
        Notification.objects.create(
            user=self.request.user,
            message=f"Bạn đã gửi câu hỏi '{consultation.question_title}' thành công. Hãy chờ phản hồi từ luật sư.",
            type="info",
            reference_id=str(consultation.id)
        )

        from django.contrib.auth import get_user_model
        User = get_user_model()
        staff_users = User.objects.filter(is_staff=True)
        for admin in staff_users:
            Notification.objects.create(
                user=admin,
                message=f"Người dùng {self.request.user.username} vừa gửi câu hỏi mới: '{consultation.question_title}'",
                type="question",
                reference_id=str(consultation.id)
            )


class UserConsultationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LegalConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LegalConsultation.objects.filter(user=self.request.user).order_by("-created_at")

# --------- Tin tức ----------
class LegalNewsViewSet(viewsets.ModelViewSet):
    """
    Tra cứu tin tức pháp luật
    /legal-news/?search=bảo+hiểm&ordering=-publish_date
    """
    queryset = LegalNews.objects.select_related("category").prefetch_related("tags", "detail").order_by("-publish_date")
    serializer_class = LegalNewsSerializer
    permission_classes = [AllowAny]
    pagination_class = None
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "content", "source"]
    ordering_fields = ["publish_date", "created_at"]

    def retrieve(self, request, *args, **kwargs):
        """
        Ghi lại lịch sử khi người dùng xem chi tiết tin tức
        """
        instance = self.get_object()
        response = super().retrieve(request, *args, **kwargs)

        if request.user.is_authenticated:
            UserActivity.objects.create(
                user=request.user,
                activity_type="news",
                reference_id=str(instance.id),
                title=instance.title,
            )

        return response


# --------- Tag ----------
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]


# --------- Lịch sử user ----------
class UserQueryViewSet(viewsets.ModelViewSet):
    queryset = UserQuery.objects.all()
    serializer_class = UserQuerySerializer


# --------- Ý định AI ----------
class QueryIntentViewSet(viewsets.ModelViewSet):
    queryset = QueryIntent.objects.all()
    serializer_class = QueryIntentSerializer


# --------- Gợi ý ----------
class QueryRecommendationViewSet(viewsets.ModelViewSet):
    queryset = QueryRecommendation.objects.all()
    serializer_class = QueryRecommendationSerializer


# --------- API rút gọn 200 VB mới nhất ----------
@api_view(["GET"])
@permission_classes([AllowAny])
def list_documents(request):
    qs = LawDocument.objects.select_related("category").order_by("-issued_date")[:200]
    return Response(LawDocumentListSerializer(qs, many=True).data)


# --------- API crawl lại chi tiết ----------
@api_view(["GET"])
@permission_classes([AllowAny])
def document_detail(request, pk):
    """
    GET /law-documents/<pk>/crawl/?force=1  -> ép crawl lại
    """
    force = request.query_params.get("force") == "1"
    doc = get_object_or_404(LawDocument, pk=pk)

    try:
        detail = getattr(doc, "detail", None)

        if force or not detail or not detail.pdf_url:
            data = crawl_document_detail(doc.source_url)
            pdf_url = data.get("pdf_url")

            if detail:
                detail.pdf_url = pdf_url
                detail.last_crawled_at = timezone.now()
                detail.save(update_fields=["pdf_url", "last_crawled_at"])
            else:
                detail = LawDocumentDetail.objects.create(
                    document=doc,
                    pdf_url=pdf_url,
                    last_crawled_at=timezone.now(),
                )

        payload = {
            "id": doc.id,
            "title": doc.title,
            "issued_by": doc.issued_by,
            "issued_date": doc.issued_date,
            "code": doc.code or "",
            "pdf_url": detail.pdf_url if detail else "",
        }
        return Response(payload, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Crawl failed: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)
    
# --------- Lịch sử truy vấn ----------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_history(request):
    """
    Trả về lịch sử hoạt động của user hiện tại (đã đăng nhập)
    """
    activities = UserActivity.objects.filter(user=request.user).order_by("-timestamp")
    serializer = UserActivitySerializer(activities, many=True)
    return Response(serializer.data)

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by("-created_at")


class MarkNotificationAsReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Notification.objects.all()

    def patch(self, request, *args, **kwargs):
        notification = self.get_object()
        if notification.recipient != request.user:
            return Response({"error": "Không có quyền"}, status=403)
        notification.is_read = True
        notification.save()
        return Response({"status": "ok"})


class MarkAllAsReadView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({"status": "ok"})
