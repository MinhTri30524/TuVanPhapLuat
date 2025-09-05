import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8080/';

const instance = axios.create({
    baseURL: BASE_URL,
});

export const endpoints = {
    'documents': 'law/law-documents/',
    documentDetail: (id) => `law/law-documents/${id}/`, 
    'news': "law/legal-news/",
    'categories': "law/law-categories/",
    'login': "api/auth/login/",
    'register': "api/auth/register/",
    'tag': "/law/tags/",
    'articles': "law/law-articles/",
};

export default instance;