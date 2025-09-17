from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import viewsets, status, filters
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .crawler import crawl_document_detail
from .pagination import CustomPagination
from .models import (
    LawCategory, LawDocument, LawArticle,
    LegalNews, Tag, UserQuery, QueryIntent, QueryRecommendation, LawDocumentDetail, LegalConsultation
)
from .serializers import (
    LawCategorySerializer, LawArticleSerializer,
    LegalNewsSerializer, TagSerializer,
    UserQuerySerializer, QueryIntentSerializer, QueryRecommendationSerializer,
    LawDocumentListSerializer, LawDocumentDetailSerializer, LegalConsultationSerializer
)


# --------- Danh mục ----------
class LawCategoryViewSet(viewsets.ModelViewSet):
    queryset = LawCategory.objects.all()
    serializer_class = LawCategorySerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagination


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


# --------- Điều khoản ----------
class LawArticleViewSet(viewsets.ModelViewSet):
    queryset = LawArticle.objects.all().order_by("order")
    serializer_class = LawArticleSerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagination

class LegalConsultationViewSet(viewsets.ModelViewSet):
    queryset = LegalConsultation.objects.all()
    serializer_class = LegalConsultationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["question_title", "answer"]
    ordering_fields = ["asked_date", "created_at"]
    ordering = ["-asked_date"]


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
