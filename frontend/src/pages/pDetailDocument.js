import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CpHeader from '../components/cpHeader';
import CpFooter from '../components/cpFooter';
import CpScrollToTop from '../components/cpScrollToTop';

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
 *  - pdfUrl: url (bắt buộc)
 */
export default function PDetailDocument({
    title,
    author,
    publishedAt,
    coverImage,
    pdfUrl,
}) {
    const navigate = useNavigate();

    // Fallback demo (nếu chưa truyền props)
    const data = useMemo(
        () => ({
            title:
                title ||
                "Nghị định 100/2019/NĐ-CP về xử phạt vi phạm hành chính trong lĩnh vực giao thông",
            author: author || "Chính phủ",
            publishedAt: publishedAt || "2019-12-30T00:00:00.000Z",
            coverImage:
                coverImage ||
                "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200",
            pdfUrl:
                pdfUrl ||
                "/assets/others/test.pdf",
        }),
        [title, author, publishedAt, coverImage, pdfUrl]
    );

    return (
        <React.Fragment>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                        <button
                            className="bg-[#1D3557] text-white px-4 py-2 rounded-full hover:opacity-90"
                            onClick={() => navigate("/vanban")}
                        >
                            Quay về danh sách
                        </button>
                        <img
                            src="/assets/imgs/LogoChu2.png"
                            alt="Tư Vấn Pháp Luật"
                            className="h-8"
                        />
                    </div>
                </div>

                {/* Nội dung */}
                <main className="max-w-5xl mx-auto px-4 py-8">
                    {/* Tiêu đề */}
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-[#1D3557]">
                        {data.title}
                    </h1>

                    {/* Meta */}
                    <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span>{data.author}</span>
                        <span>•</span>
                        <time dateTime={data.publishedAt}>
                            {formatDate(data.publishedAt)}
                        </time>
                    </div>

                    {/* Ảnh minh họa (nếu có) */}
                    {data.coverImage && (
                        <figure className="mt-6 overflow-hidden rounded-2xl border bg-white">
                            <img
                                src={data.coverImage}
                                alt="Ảnh minh họa văn bản"
                                className="w-full h-auto object-cover"
                            />
                            <figcaption className="text-xs text-gray-500 p-3">
                                Ảnh minh họa
                            </figcaption>
                        </figure>
                    )}

                    {/* PDF Viewer */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-3 text-[#1D3557]">
                            Văn bản gốc (PDF)
                        </h2>
                        <div className="w-full border rounded-lg overflow-hidden">
                            <iframe
                                src={`${data.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                                title="PDF Viewer"
                                className="w-full"
                                style={{ height: "80vh" }}
                            />
                        </div>

                        {/* Link tải xuống */}
                        <div className="mt-4">
                            <a
                                href={data.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-[#1D3557] hover:bg-gray-100"
                            >
                                📥 Tải văn bản PDF
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </React.Fragment>
    );
}
