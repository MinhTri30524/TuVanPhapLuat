import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8080/';

const instance = axios.create({
    baseURL: BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const endpoints = {
    'current_user': "api/auth/me/",
    'documents': 'law/law-documents/',
    documentDetail: (id) => `law/law-documents/${id}/`, 
    'news': "law/legal-news/",
    'categories': "law/law-categories/",
    'login': "api/auth/login/",
    'register': "api/auth/register/",
    'tag': "/law/tags/",
    'articles': "law/law-articles/",
    'chatbot': "/api/chat/chatbot/", 
    'conversations': "api/chat/conversations/",
    'consultations': "/law/consultations/",
    'my_consultations': "/law/my-consultations/",
    'user_history': '/law/user-history/',
    'notifications': '/law/notifications/',
};

export default instance;