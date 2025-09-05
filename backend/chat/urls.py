from django.urls import path
from .views import ChatbotView, TestOpenAI

urlpatterns = [
    path("chatbot/", ChatbotView.as_view(), name="chatbot"),
    path("test/", TestOpenAI.as_view(), name="test_openai"),
]
