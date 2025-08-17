from django.db import models
from django.conf import settings

class LawCategory(models.Model): #phân loại
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class LawDocument(models.Model): #văn bản luật
    title = models.CharField(max_length=500)
    code = models.CharField(max_length=100, blank=True)  # VD: 45/2019/QH14
    category = models.ForeignKey(LawCategory, on_delete=models.CASCADE, related_name='documents')
    
    issued_by = models.CharField(max_length=255, blank=True)  # Cơ quan ban hành
    issued_date = models.DateField()         # Ngày ban hành
    effective_date = models.DateField()      # Ngày hiệu lực
    expired_date = models.DateField(null=True, blank=True)

    summary = models.TextField(blank=True)   # Mô tả tóm tắt
    source_url = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-issued_date']

    def __str__(self):
        return f"{self.title} ({self.code})"


class LawArticle(models.Model): #Điều khoản
    document = models.ForeignKey(LawDocument, on_delete=models.CASCADE, related_name='articles')
    article_number = models.CharField(max_length=20)  # VD: Điều 12
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.article_number} - {self.title or 'No Title'}"


class Tag(models.Model): #phân loại từ khoá
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class LegalNews(models.Model): #tin tức pháp luật
    title = models.CharField(max_length=500)
    content = models.TextField()
    source = models.CharField(max_length=255, blank=True)  # Ví dụ: Báo Lao Động
    publish_date = models.DateField()
    source_url = models.URLField(blank=True)

    thumbnail = models.ImageField(upload_to='news_thumbnails/', blank=True, null=True)

    tags = models.ManyToManyField(Tag, blank=True, related_name='news')  # Gộp bảng trung gian

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-publish_date']

    def __str__(self):
        return self.title
    
class UserQuery(models.Model):  # lịch sử câu hỏi người dùng
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # dùng user model đã custom
        on_delete=models.CASCADE,
        related_name="queries"
    )
    query_text = models.TextField(help_text="Câu hỏi gốc của người dùng")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Query {self.id} by {self.user.username}"



class QueryIntent(models.Model): #Ý định được phân loại
    query = models.ForeignKey(UserQuery, on_delete=models.CASCADE, related_name="intents")
    intent_label = models.CharField(max_length=255, help_text="Tên ý định do AI phân loại")
    confidence = models.FloatField(default=0.0, help_text="Độ tin cậy của phân loại")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Intent: {self.intent_label} ({self.confidence:.2f})"


class QueryRecommendation(models.Model): #Gợi ý câu hỏi hoặc văn bản
    intent = models.ForeignKey(QueryIntent, on_delete=models.CASCADE, related_name="recommendations")
    recommended_text = models.TextField(help_text="Câu hỏi hoặc văn bản gợi ý")
    related_document = models.ForeignKey(
        "LawDocument", on_delete=models.SET_NULL, null=True, blank=True,
        help_text="Tài liệu luật liên quan nếu có"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recommendation for intent {self.intent.intent_label}"
