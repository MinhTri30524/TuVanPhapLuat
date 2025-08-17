import React, { useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from 'react-router-dom';

const formatDate = (iso) =>
    new Date(iso).toLocaleString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

/**
 * Props gợi ý:
 *  - title: string
 *  - author: string
 *  - publishedAt: ISO string
 *  - coverImage: url hoặc null
 *  - contentMd: Markdown string
 *  - pdfUrl: url hoặc null
 */
export default function PDetail({ title, author, publishedAt, coverImage, contentMd, pdfUrl, }) {
    const navigate = useNavigate();
    // Fallback demo (nếu chưa truyền props)
    const data = useMemo(
        () => ({
            title:
                title ||
                "Chính sách mới về xử phạt vi phạm giao thông đường bộ từ 2025",
            author: author || "Ban Biên tập • Tư Vấn Pháp Luật",
            publishedAt: publishedAt || "2025-08-10T09:15:00.000Z",
            coverImage:
                coverImage ||
                "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200",
            contentMd:
                contentMd ||
                `> **Tóm tắt:** Bài viết điểm qua các thay đổi nổi bật về mức phạt, thủ tục xử phạt và quy trình khiếu nại.

## Điểm mới đáng chú ý
- Tăng mức phạt cho hành vi nồng độ cồn vượt ngưỡng.
- Bổ sung quy định **biên bản điện tử** và **thanh toán không tiền mặt**.
- Hướng dẫn rõ hơn về **quyền và nghĩa vụ** của người bị xử phạt.

## Câu hỏi thường gặp
1. **Thời điểm áp dụng?**  
   Hiệu lực kể từ **01/01/2025**.

2. **Có bắt buộc nộp phạt trực tuyến?**  
   Không bắt buộc, nhưng được **khuyến khích**.

\`\`\`diff
+ Lưu ý: Kiểm chứng thông tin trên văn bản gốc trước khi áp dụng.
\`\`\`

---

### Tài liệu liên quan
- Luật Giao thông đường bộ (sửa đổi)
- Nghị định hướng dẫn thi hành

*Bài viết mang tính tham khảo, không thay thế tư vấn pháp lý cụ thể.*`,
            pdfUrl:
                pdfUrl ||
                null, // đặt URL file PDF nếu có, ví dụ: "/files/nghi-dinh-xyz.pdf"
        }),
        [title, author, publishedAt, coverImage, contentMd, pdfUrl]
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header minimal */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button className="bg-[#1D3557] text-white px-4 py-2 rounded-full hover:opacity-90" onClick={() => navigate('/tintuc')}>
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
                    {data.title}
                </h1>

                {/* Meta */}
                <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                    <span>{data.author}</span>
                    <span>•</span>
                    <time dateTime={data.publishedAt}>{formatDate(data.publishedAt)}</time>
                </div>

                {/* Ảnh cover (nếu có) */}
                {data.coverImage && (
                    <figure className="mt-6 overflow-hidden rounded-2xl border bg-white">
                        <img
                            src={data.coverImage}
                            alt="Ảnh minh họa bài viết"
                            className="w-full h-auto object-cover"
                        />
                        <figcaption className="text-xs text-gray-500 p-3">
                            Ảnh minh họa
                        </figcaption>
                    </figure>
                )}

                {/* File PDF (nếu có) */}
                {data.pdfUrl && (
                    <div className="mt-6">
                        <a
                            href={data.pdfUrl}
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
                        {data.contentMd}
                    </Markdown>
                </article>

                {/* Chia sẻ / tác vụ phụ (tuỳ chọn) */}
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
