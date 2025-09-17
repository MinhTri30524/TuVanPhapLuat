from rest_framework import serializers
from .models import Conversation, ChatTurn

class ChatTurnSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatTurn
        fields = "__all__"

class ConversationSerializer(serializers.ModelSerializer):
    turns = ChatTurnSerializer(many=True, read_only=True)
    class Meta:
        model = Conversation
        fields = "__all__"
