from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatbotView, ConversationViewSet, ChatTurnViewSet, ConversationView

router = DefaultRouter()
router.register(r"conversations", ConversationViewSet, basename="conversation")
router.register(r"chatturns", ChatTurnViewSet, basename="chatturn")

urlpatterns = [
    path("chatbot/", ChatbotView.as_view(), name="chatbot"),

    # gửi tin nhắn vào cuộc hội thoại
    path("chat/conversations/<int:convo_id>/send/", ConversationView.as_view(), name="chat_send"),
    path("chat/conversations/send/", ConversationView.as_view(), name="chat_send_new"),

    # crud hội thoại / chatturn
    path("", include(router.urls)),
]
