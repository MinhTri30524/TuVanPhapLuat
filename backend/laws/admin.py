from django.contrib import admin
from .models import (
    LawCategory, LawDocument, LawArticle,
    LegalNews, Tag, UserQuery, QueryIntent, QueryRecommendation
)


admin.site.register(LawCategory)
admin.site.register(LawDocument)
admin.site.register(LawArticle)
admin.site.register(LegalNews)
admin.site.register(Tag)
admin.site.register(UserQuery)
admin.site.register(QueryIntent)
admin.site.register(QueryRecommendation)
