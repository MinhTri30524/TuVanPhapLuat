from django.shortcuts import render
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .crawler import crawl_document_detail
from .pagination import CustomPagination
from .models import (
    LawCategory, LawDocument, LawArticle,
    LegalNews, Tag, UserQuery, QueryIntent, QueryRecommendation, LawDocumentDetail, LegalNewsDetail
)
from .serializers import (
    LawCategorySerializer, LawArticleSerializer,
    LegalNewsSerializer, TagSerializer, UserQuerySerializer, QueryIntentSerializer, QueryRecommendationSerializer, LawDocumentListSerializer, LawDocumentDetailSerializer, LegalNewsDetailSerializer
)

class LawCategoryViewSet(viewsets.ModelViewSet):
    queryset = LawCategory.objects.all()
    serializer_class = LawCategorySerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagination

class LawDocumentViewSet(viewsets.ModelViewSet):
    queryset = LawDocument.objects.all()
    permission_classes = [AllowAny]
    pagination_class = CustomPagination

    def get_serializer_class(self):
        if self.action == "list":
            return LawDocumentListSerializer
        return LawDocumentDetailSerializer
        

class LawArticleViewSet(viewsets.ModelViewSet):
    queryset = LawArticle.objects.all().order_by('order')
    serializer_class = LawArticleSerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagination


class LegalNewsViewSet(viewsets.ModelViewSet):
    queryset = LegalNews.objects.all().order_by('-publish_date')
    serializer_class = LegalNewsSerializer
    permission_classes = [AllowAny]
    pagination_class = None



class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]

#lịch sử người dùng
class UserQueryViewSet(viewsets.ModelViewSet):
    queryset = UserQuery.objects.all()
    serializer_class = UserQuerySerializer

#ý định phân loại cho AI
class QueryIntentViewSet(viewsets.ModelViewSet):
    queryset = QueryIntent.objects.all()
    serializer_class = QueryIntentSerializer

#gợi ý từ intent
class QueryRecommendationViewSet(viewsets.ModelViewSet):
    queryset = QueryRecommendation.objects.all()
    serializer_class = QueryRecommendationSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def list_documents(request):
    qs = LawDocument.objects.select_related("category").order_by("-issued_date")[:200]
    return Response(LawDocumentListSerializer(qs, many=True).data)

@api_view(["GET"])
@permission_classes([AllowAny])
def document_detail(request, pk):
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
        return Response(
            {"error": f"Crawl failed: {str(e)}"},
            status=status.HTTP_502_BAD_GATEWAY
        )

