import React, { useState, useEffect } from "react";
import CpHeader from "../components/cpHeader";
import CpFooter from "../components/cpFooter";
import instance, { endpoints } from "../configs/Apis";
import ConsultationDialog from "../components/ConsultationDialog";
import CreateConsultationDialog from "../components/CreateConsultationDialog";
import CheckAuthen from "../components/CheckAuthen";

function PAdvise() {
  const [activeTab, setActiveTab] = useState("chuyengia");
  const [consultations, setConsultations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  const [openAuthDialog, setOpenAuthDialog] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  // Load categories
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

  // Load consultations
  useEffect(() => {
    const fetchConsultations = async () => {
      if (activeTab !== "chuyengia") return;
      try {
        setLoading(true);
        let url = `${endpoints.consultations}?page=${page}`;
        if (selectedCategory) url += `&category=${selectedCategory.id}`;
        let res = await instance.get(url);

        setConsultations(res.data.results || res.data);
        setCount(res.data.count || 0);
        setError(null);
      } catch (err) {
        console.error("Lỗi load consultations:", err);
        setError("Không thể tải dữ liệu từ server.");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, [page, selectedCategory, activeTab]);

  // Load my consultations
  useEffect(() => {
    const fetchMyConsultations = async () => {
      if (activeTab !== "myquestions") return;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        let res = await instance.get(endpoints.my_consultations, {
          headers: { Authorization: `Token ${token}` },
        });
        setConsultations(res.data.results || res.data);
        setCount(res.data.count || res.data.length);
        setError(null);
      } catch (err) {
        console.error("Lỗi load my consultations:", err);
        setError("Không thể tải dữ liệu của bạn.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyConsultations();
  }, [activeTab]);

  // Pagination logic
  const pageSize = 10;
  const totalPages = Math.ceil(count / pageSize);

  const checkLogin = (action) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOpenAuthDialog(true);
    } else {
      if (action === "create") setOpenCreate(true);
      if (action === "chatbot") window.location.href = "/chat";
    }
  };

  return (
    <React.Fragment>
      <CpHeader />
      <div className="py-20">
        <section
          className="bg-cover bg-center text-white py-12 px-6"
          style={{ backgroundImage: "url('/assets/imgs/banner.jpg')" }}
        >
          <h1 className="text-3xl font-bold">LUẬT SƯ TƯ VẤN</h1>
          <p className="text-lg">
            Cùng hỏi đáp và nghe tư vấn từ các chuyên gia luật
          </p>
        </section>

        {/* Tabs */}
        <div className="flex border-b mt-4">
          <button
            onClick={() => setActiveTab("chuyengia")}
            className={`px-4 py-2 ${
              activeTab === "chuyengia"
                ? "border-b-2 border-orange-500 font-semibold"
                : ""
            }`}
          >
            Hỏi đáp cùng chuyên gia
          </button>
          <button
            onClick={() => setActiveTab("myquestions")}
            className={`px-4 py-2 ${
              activeTab === "myquestions"
                ? "border-b-2 border-orange-500 font-semibold"
                : ""
            }`}
          >
            Câu hỏi của tôi
          </button>
        </div>

        {/* Main Content */}
        <div className="flex mt-6 px-4">
          {/* Sidebar categories */}
          {activeTab === "chuyengia" && (
            <aside className="w-1/4 border-r p-4 max-h-[500px] overflow-y-auto">
              <h3 className="font-semibold mb-4">Chủ đề</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setPage(1);
                    }}
                    className={`cursor-pointer ${
                      selectedCategory?.id === cat.id
                        ? "text-red-600 font-semibold"
                        : "text-[#1D3557] hover:text-red-600"
                    }`}
                  >
                    {cat.name}
                  </li>
                ))}
                <li
                  onClick={() => {
                    setSelectedCategory(null);
                    setPage(1);
                  }}
                  className={`cursor-pointer mt-4 ${
                    selectedCategory === null
                      ? "text-red-600 font-semibold"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  Tất cả
                </li>
              </ul>
            </aside>
          )}

          {/* Question list */}
          <div
            className={`${
              activeTab === "chuyengia" ? "w-3/4" : "w-full"
            } p-4 space-y-4`}
          >
            <h2 className="text-xl font-bold mb-2">
              {activeTab === "myquestions"
                ? "CÂU HỎI CỦA TÔI"
                : selectedCategory?.name || "TẤT CẢ CÂU HỎI"}
            </h2>

            {loading && <p className="text-gray-500">Đang tải dữ liệu...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading &&
              !error &&
              consultations.map((q) => (
                <div
                  key={q.id}
                  className="border-b pb-2 cursor-pointer"
                  onClick={() => {
                    setSelectedConsultation(q);
                    setOpenDetail(true);
                  }}
                >
                  <p className="text-sm text-gray-500">
                    #{q.question_id} - {q.category?.name} -{" "}
                    {q.asked_date || "—"}
                  </p>
                  <p className="font-medium text-[#1D3557] hover:text-red-600">
                    {q.question_title}
                  </p>
                </div>
              ))}

            {!loading && !error && consultations.length === 0 && (
              <p className="text-gray-500">Không có câu hỏi nào.</p>
            )}

            {/* Pagination */}
            {activeTab === "chuyengia" && totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      page === i + 1
                        ? "bg-orange-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Buttons */}
        <div className="fixed bottom-6 right-6 space-y-3">
          <button
            onClick={() => checkLogin("create")}
            className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 mr-2"
          >
            + Tạo câu hỏi
          </button>

          <button
            onClick={() => checkLogin("chatbot")}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-900"
          >
            Hỏi với AI
          </button>
        </div>

        {/* Dialogs */}
        <ConsultationDialog
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          consultation={selectedConsultation}
        />

        <CreateConsultationDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          categories={categories}
          onSuccess={() => {
            if (activeTab === "chuyengia") setPage(1);
            else setActiveTab("myquestions");
          }}
        />
        <CheckAuthen
          open={openAuthDialog}
          onLogin={() => (window.location.href = "/login")}
          onRegister={() => (window.location.href = "/register")}
        />
      </div>
      <CpFooter />
    </React.Fragment>
  );
}

export default PAdvise;
