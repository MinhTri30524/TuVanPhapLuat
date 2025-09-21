import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CpHeader from "../components/cpHeader";
import CpFooter from "../components/cpFooter";
import CpScrollToTop from "../components/cpScrollToTop";
import instance, { endpoints } from "../configs/Apis";
import slugify from "slugify";

// Chuẩn hoá để so sánh
const norm = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function PDocument() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    type: "",
    status: "",
    category: "",
  });

  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // phân trang
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10); // nếu API mặc định 10
  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchDocs = async (pageNum = 1) => {
    try {
      setLoading(true);
      let res = await instance.get(`${endpoints.documents}?page=${pageNum}`);
      setDocuments(res.data.results || []);
      setTotalCount(res.data.count || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu từ server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs(page);
  }, [page]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let res = await instance.get(endpoints.categories);
        setCategories(res.data.results || res.data);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Lọc (chạy trên dữ liệu trang hiện tại)
  const filteredDocs = documents.filter((doc) => {
    const titleOk = norm(doc.title).includes(norm(search));
    const typeOk = filter.type === "" || norm(doc.title).includes(norm(filter.type));
    const statusOk = filter.status === "" || norm(doc.status) === norm(filter.status);
    const categoryOk =
      filter.category === "" || norm(doc?.category?.name) === norm(filter.category);

    return titleOk && typeOk && statusOk && categoryOk;
  });

  // render số trang
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 border rounded-lg ${
            i === page ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className={`px-3 py-1 border rounded-lg ${
            page === 1 ? "bg-gray-200" : "bg-white"
          }`}
        >
          Trước
        </button>
        {pages}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className={`px-3 py-1 border rounded-lg ${
            page === totalPages ? "bg-gray-200" : "bg-white"
          }`}
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <CpHeader />
      <div className="p-12 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Văn bản mới - Văn bản pháp luật</h1>

        {/* Ô tìm kiếm */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Nhập nội dung cần tìm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <button
            onClick={() => fetchDocs(1)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg whitespace-nowrap"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">-- Loại văn bản --</option>
            <option value="Quyết định">Quyết định</option>
            <option value="Nghị định">Nghị định</option>
            <option value="Thông báo">Thông báo</option>
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">-- Tình trạng hiệu lực --</option>
            <option value="Còn Hiệu lực">Còn hiệu lực</option>
            <option value="Hết hiệu lực">Hết hiệu lực</option>
            <option value="Chưa áp dụng">Chưa áp dụng</option>
          </select>

          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">-- Lĩnh vực tra cứu --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Danh sách văn bản */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                onClick={() =>
                  navigate(
                    `/vanban/${slugify(doc.title, { lower: true, strict: true })}/${doc.id}`
                  )
                }
              >
                <h2 className="text-lg font-semibold text-blue-600 mb-2">{doc.title}</h2>
                <p className="text-sm text-gray-500 mb-1">
                  <b>Ngày ban hành:</b> {doc.issued_date || "Chưa rõ"}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <b>Ngày áp dụng:</b> {doc.applied_date || "Chưa rõ"}
                </p>
                <p className="text-sm mb-1">
                  <b>Trạng thái:</b>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      doc.status === "Còn hiệu lực"
                        ? "bg-green-600"
                        : doc.status === "Hết hiệu lực"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {doc.status || "Không rõ"}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Cập nhật: {doc.updated_date || "—"}
                </p>
              </div>
            ))}
          </div>
        )}

        {renderPagination()}
      </div>
      <CpScrollToTop />
      <CpFooter />
    </React.Fragment>
  );
}

export default PDocument;
