import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance, { endpoints } from "../configs/Apis";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // lấy id từ url
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        let res = await instance.get(`${endpoints.news}${id}/`);
        setData(res.data);
      } catch (err) {
        console.error("Lỗi load news:", err);
      }
    };
    loadNews();
  }, [id]);

  if (!data) return <p className="p-6 text-gray-500">⏳ Đang tải tin tức...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header minimal */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            className="bg-[#1D3557] text-white px-4 py-2 rounded-full hover:opacity-90"
            onClick={() => navigate("/tintuc")}
          >
            Quay về trang
          </button>
          <img
            src="/assets/imgs/LogoChu2.png"
            alt="Tư Vấn Pháp Luật"
            className="h-8"
          />
        </div>
      </div>

      {/* Nội dung */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Tiêu đề */}
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-[#1D3557]">
          {data.detail?.title || data.title}
        </h1>

        {/* Meta */}
        <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
          {data.detail?.author && <span>{data.detail.author}</span>}
          {data.detail?.published_at && (
            <>
              <span>•</span>
              <time dateTime={data.detail.published_at}>
                {formatDate(data.detail.published_at)}
              </time>
            </>
          )}
        </div>

        {/* Ảnh cover (nếu có) */}
        {/* {data.detail?.cover_image && (
          <figure className="mt-6 overflow-hidden rounded-2xl border bg-white">
            <img
              src={data.detail.cover_image}
              alt="Ảnh minh họa bài viết"
              className="w-full h-auto object-cover"
            />
            <figcaption className="text-xs text-gray-500 p-3">
              Ảnh minh họa
            </figcaption>
          </figure>
        )} */}

        {/* File PDF (nếu có) */}
        {data.detail?.pdf_url && (
          <div className="mt-6">
            <a
              href={data.detail.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-[#1D3557] hover:bg-gray-100"
            >
              📄 Xem văn bản/PDF đính kèm
            </a>
          </div>
        )}

        {/* Nội dung Markdown */}
        <article className="prose prose-sm md:prose-base lg:prose-lg max-w-none mt-8 prose-headings:text-[#1D3557] prose-a:text-[#1D3557]">
          <Markdown remarkPlugins={[remarkGfm]}>
            {data.detail?.content_md || data.content}
          </Markdown>
        </article>

        {/* Chia sẻ */}
        <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-gray-500">Chia sẻ:</span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : ""
            )}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border px-3 py-1 hover:bg-gray-100"
          >
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : ""
            )}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border px-3 py-1 hover:bg-gray-100"
          >
            Twitter/X
          </a>
        </div>
      </main>
    </div>
  );
}
