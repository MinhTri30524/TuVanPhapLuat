import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings

from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

from laws.models import LawDocument


class Command(BaseCommand):
    help = "Build FAISS index từ LawDocument (chỉ lấy title)"

    def handle(self, *args, **options):
        qs = LawDocument.objects.select_related("category").all().order_by("-issued_date")

        docs = []
        for law in qs:
            if not law.title:
                continue

            meta = {
                "id": law.id,
                "title": law.title,
                "code": law.code,
                "issued_by": law.issued_by,
                "issued_date": law.issued_date.isoformat() if law.issued_date else "",
                "category": law.category.name if law.category else "Khác",
                "status": law.status,
                "source_url": law.source_url,
            }

            docs.append(Document(page_content=law.title, metadata=meta))

        if not docs:
            self.stdout.write(self.style.WARNING("Không có tài liệu luật để index"))
            return

        # chunk (title thường ngắn, nhưng vẫn giữ cho đồng bộ)
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1200,
            chunk_overlap=150,
            separators=["\n\n", "\n", ". ", " "],
        )
        chunked_docs = splitter.split_documents(docs)
        self.stdout.write(f"Tổng document sau chunk: {len(chunked_docs)}")

        # embeddings + FAISS
        embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        vs = FAISS.from_documents(chunked_docs, embeddings)

        out_dir = Path(settings.BASE_DIR) / "vectorstores" / "laws_faiss"
        out_dir.parent.mkdir(parents=True, exist_ok=True)
        vs.save_local(str(out_dir))

        self.stdout.write(self.style.SUCCESS(f"Đã lưu FAISS vào: {out_dir}"))
