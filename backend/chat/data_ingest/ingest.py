# chat/data_ingest/ingest.py
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import pickle

def build_vector_db(document_content, save_path="chat/vectorstore.pkl"):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_text(document_content)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    db = FAISS.from_texts(docs, embeddings)

    with open(save_path, "wb") as f:
        pickle.dump(db, f)

    print("Vector DB đã lưu tại:", save_path)


if __name__ == "__main__":
    content = "Luật dân sự Việt Nam quy định về quyền sở hữu, nghĩa vụ hợp đồng..."
    build_vector_db(content)
