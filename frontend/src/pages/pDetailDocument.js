// pages/PDetailDocument.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import slugify from "slugify";
import instance, { endpoints } from "../configs/Apis";
import CpFooter from "../components/cpFooter";

const formatDate = (iso) =>
  new Date(iso).toLocaleString("vi-VN", {
    year: "numeric", month: "long", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });

export default function PDetailDocument() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedDocs, setRelatedDocs] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await instance.get(endpoints.documentDetail(id));
        if (mounted) {
          setData(res.data);

          // gọi thêm văn bản liên quan cùng category
          if (res.data.category) {
            const relatedRes = await instance.get(
              endpoints.documentsByCategory(res.data.category, 5)
            );
            // lọc bỏ chính nó
            const filtered = relatedRes.data.filter((doc) => doc.id !== parseInt(id));
            setRelatedDocs(filtered);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; }
  }, [id]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!data) return <div className="p-6">Không lấy được dữ liệu.</div>;

  return (<React.Fragment>
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
          <img src="/assets/imgs/LogoChu2.png" alt="Tư Vấn Pháp Luật" className="h-16" />
        </div>
      </div>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Cột trái: nội dung chính */}
        <div className="md:col-span-3">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-[#1D3557]">
            {data.title}
          </h1>

          <div className="mt-3 mb-3 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
            <span>Mã: {data.code}</span>
            <span>•</span>
            <span>{data.issued_by}</span>
            <span>•</span>
            <time dateTime={data.issued_date}>{formatDate(data.issued_date)}</time>
          </div>

          {data && data.pdf_url ? (
            <div className="w-full border rounded-lg overflow-hidden">
              <iframe
                src={`${data.pdf_url}#toolbar=1&navpanes=0&scrollbar=1`}
                title="PDF Viewer"
                className="w-full"
                style={{ height: "80rem" }}
              />
            </div>
          ) : (
            <div className="text-red-600">
              Chưa tìm thấy file PDF cho văn bản này.
            </div>
          )}
        </div>

        {/* Cột phải: văn bản liên quan */}
        <aside className="md:col-span-1">
          <h2 className="text-lg font-semibold text-[#1D3557] mb-3">
            Văn bản liên quan
          </h2>
          <div className="space-y-3">
            {relatedDocs.length > 0 ? (
              relatedDocs.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/vanban/${slugify(doc.title, { lower: true, strict: true })}-${doc.id}`}
                  className="block p-3 bg-white rounded-lg shadow hover:shadow-md transition"
                >
                  <p className="font-medium text-sm line-clamp-2">{doc.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(doc.issued_date)}</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Không có văn bản liên quan.</p>
            )}
          </div>
        </aside>
      </main>
    </div>
    <CpFooter />
  </React.Fragment>);
}
