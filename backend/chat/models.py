from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatHistory(models.Model):
    user_input = models.TextField()
    bot_response = models.TextField() 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat at {self.created_at}"
    
class UserIntent(models.Model):
    raw_text = models.TextField()
    intent = models.CharField(max_length=200)
    confidence = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.intent} ({self.created_at:%d-%m-%Y})"
    

#lấy nội dung cuộc thoại tin nhắn, sau đó gợi ý và rẻ nhánh sau
class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    state = models.CharField(max_length=50, default="init")
    created_at = models.DateTimeField(auto_now_add=True)

class ChatTurn(models.Model):
    convo = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="turns")
    sender = models.CharField(max_length=10, choices=[("user","User"), ("bot","Bot")])
    text = models.TextField()
    meta = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
