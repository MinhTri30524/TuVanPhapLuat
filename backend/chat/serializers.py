from rest_framework import serializers
from .models import Conversation, ChatTurn

class ChatTurnSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatTurn
        fields = "__all__"

class ConversationSerializer(serializers.ModelSerializer):
    turns = ChatTurnSerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Conversation
        fields = ['id', 'user', 'title', 'state', 'created_at', 'turns']
