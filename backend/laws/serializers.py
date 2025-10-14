from rest_framework import serializers
from .models import (
    LawCategory, LawDocument, LawArticle,
    LegalNews, Tag, UserQuery, QueryIntent, QueryRecommendation, LegalNewsDetail, LegalConsultation,
    UserActivity, Notification
)

class LawCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LawCategory
        fields = '__all__'


class LawArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = LawArticle
        fields = '__all__'

class LegalConsultationSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    category = LawCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=LawCategory.objects.all(),
        source="category",
        write_only=True
    )

    class Meta:
        model = LegalConsultation
        fields = [
            "id",
            "question_id",
            "question_title",
            "category",       # chỉ để đọc
            "category_id",    # để ghi
            "question_url",
            "asked_date",
            "answer",
            "created_at",
            "user",
        ]

    def get_user(self, obj):
        if obj.user:
            return {
                "id": obj.user.id,
                "username": obj.user.username,
                "email": obj.user.email,
            }
        return None


class LawDocumentListSerializer(serializers.ModelSerializer):
    category = LawCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=LawCategory.objects.all(), source="category", write_only=True
    )

    class Meta:
        model = LawDocument
        fields = ["id", "title", "code", "issued_by", "issued_date", "status", "source_url", "category", "category_id"]


class LawDocumentDetailSerializer(serializers.ModelSerializer):
    articles = LawArticleSerializer(many=True, read_only=True)
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = LawDocument
        fields = [
            "id", "title", "code", "issued_by", "issued_date", "applied_date",
            "status", "updated_date", "pdf_url", "summary", "source_url", "articles"
        ]

    def get_pdf_url(self, obj):
        if hasattr(obj, "detail") and obj.detail and obj.detail.pdf_url:
            return obj.detail.pdf_url
        return None


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class LegalNewsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalNewsDetail
        fields = [
            "id",
            "title",
            "author",
            "published_at",
            "cover_image",
            "content_md",
            "pdf_url",
        ]

class LegalNewsSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    category = LawCategorySerializer()
    detail = LegalNewsDetailSerializer(read_only=True)

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

class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    actor_first_name = serializers.CharField(source="actor.first_name", read_only=True)
    actor_last_name = serializers.CharField(source="actor.last_name", read_only=True)
    actor_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id", "notification_type", "message", "is_read", "link", "created_at",
            "actor_first_name", "actor_last_name", "actor_avatar"
        ]

    def get_actor_avatar(self, obj):
        return f"/media/avatars/{obj.actor.id}.jpg" if obj.actor else "/default-avatar.png"
