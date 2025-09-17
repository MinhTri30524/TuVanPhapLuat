from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

class LawCategory(models.Model): #phân loại
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name



class LawDocument(models.Model):
    title = models.CharField(max_length=500)
    code = models.CharField(max_length=100, blank=True)
    category = models.ForeignKey(LawCategory, on_delete=models.CASCADE, related_name='documents')

    issued_by = models.CharField(max_length=255, blank=True)
    issued_date = models.DateField()
    applied_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=255, blank=True)
    updated_date = models.DateField(null=True, blank=True)

    summary = models.TextField(blank=True)
    source_url = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-issued_date']

    def __str__(self):
        return f"{self.title} ({self.code})"


class LawDocumentDetail(models.Model):
    document = models.OneToOneField(LawDocument, on_delete=models.CASCADE, related_name='detail')
    pdf_url = models.URLField(max_length=1000, blank=True, null=True)

    signer = models.CharField(max_length=255, blank=True, null=True)
    effective_status = models.CharField(max_length=100, blank=True, null=True)

    last_crawled_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Detail of #{self.document_id}"


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
    
class LegalConsultation(models.Model):  # Câu hỏi tư vấn
    question_id = models.CharField(max_length=20, unique=True)  
    question_title = models.CharField(max_length=500)  
    category = models.ForeignKey(LawCategory, on_delete=models.CASCADE)  # Khóa ngoại
    question_url = models.URLField(max_length=1000)  
    asked_date = models.DateField(null=True, blank=True)  
    answer = models.TextField(blank=True, null=True)  

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-asked_date']

    def __str__(self):
        return f"{self.question_id} - {self.question_title}"


class Tag(models.Model): #phân loại từ khoá
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class LegalNews(models.Model):
    title = models.CharField(max_length=500)
    content = models.TextField(blank=True)
    source = models.CharField(max_length=255, blank=True)
    publish_date = models.DateField(null=True, blank=True)
    source_url = models.URLField(blank=True)

    thumbnail = models.URLField(blank=True, null=True)

    tags = models.ManyToManyField('Tag', blank=True, related_name='news') 
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(LawCategory, on_delete=models.SET_NULL, null=True, related_name="news")

    class Meta:
        ordering = ['-publish_date']

    def __str__(self):
        return self.title
    
class LegalNewsDetail(models.Model):
    news = models.OneToOneField(
        'LegalNews',
        on_delete=models.CASCADE,
        related_name='detail'
    )

    title = models.CharField(max_length=500)
    author = models.CharField(max_length=255, blank=True, null=True)
    published_at = models.DateTimeField(null=True, blank=True)
    cover_image = models.URLField(blank=True, null=True)
    content_md = models.TextField(blank=True, null=True)
    pdf_url = models.URLField(blank=True, null=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return f"Chi tiết: {self.title}"

    
class UserQuery(models.Model):  #lịch sử câu hỏi
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
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


@receiver(post_save, sender=LawDocument)
def create_document_detail(sender, instance, created, **kwargs):
    if created:
        LawDocumentDetail.objects.create(document=instance)