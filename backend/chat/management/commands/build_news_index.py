import os
import re
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings

from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

from laws.models import LegalNews 

CLEAN_MD_IMG = re.compile(r"!\[[^\]]*\]\([^)]+\)")
CLEAN_MD_LINK = re.compile(r"\[([^\]]+)\]\([^)]+\)")

def md_to_plain(md: str) -> str:
    if not md:
        return ""
    # bỏ ảnh ![...](...)
    md = CLEAN_MD_IMG.sub("", md)
    # giữ text, bỏ URL của link markdown [text](url) -> text
    md = CLEAN_MD_LINK.sub(r"\1", md)
    # loại bớt quảng cáo/placeholder phổ biến nếu có
    md = md.replace("Advertisements", "").strip()
    return md

class Command(BaseCommand):
    help = "Build FAISS index từ LegalNews/LegalNewsDetail"

    def handle(self, *args, **options):
        qs = (
            LegalNews.objects
            .select_related("detail", "category")
            .order_by("-publish_date")
        )

        docs: list[Document] = []
        for n in qs:
            title = n.title or ""
            url = n.source_url or ""
            source = n.source or ""
            publish_date = str(n.publish_date) if n.publish_date else ""
            cat = n.category.name if n.category else "Khác"

            # nội dung ưu tiên từ detail.content_md, fallback sang content (tóm tắt)
            raw_text = ""
            if hasattr(n, "detail") and n.detail and n.detail.content_md:
                raw_text = n.detail.content_md
            elif n.content:
                raw_text = n.content

            text = md_to_plain(raw_text)
            if not text:
                continue

            # tạo Document 1 cái dài, rồi sẽ chunk bên dưới
            base_meta = {
                "news_id": n.id,
                "title": title,
                "url": url,
                "source": source,
                "publish_date": publish_date,
                "category": cat,
            }
            docs.append(Document(page_content=text, metadata=base_meta))

        if not docs:
            self.stdout.write(self.style.WARNING("Không có tài liệu để index"))
            return

        # chunk
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1200,  # ký tự
            chunk_overlap=150,
            separators=["\n\n", "\n", ". ", " "]
        )
        chunked_docs = splitter.split_documents(docs)

        self.stdout.write(f"Tổng document sau chunk: {len(chunked_docs)}")

        # embeddings + FAISS
        embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        vs = FAISS.from_documents(chunked_docs, embeddings)

        out_dir = Path(settings.BASE_DIR) / "vectorstores" / "news_faiss"
        out_dir.parent.mkdir(parents=True, exist_ok=True)
        vs.save_local(str(out_dir))

        self.stdout.write(self.style.SUCCESS(f"Đã lưu FAISS vào: {out_dir}"))
