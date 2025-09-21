import React, { useState } from "react";
import instance, { endpoints } from "../configs/Apis";

export default function CreateConsultationDialog({
  open,
  onClose,
  categories,
  onSuccess,
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category)
      return alert("Vui lòng nhập đầy đủ thông tin.");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await instance.post(
        endpoints.consultations,
        { question_title: title, category_id: category },
        { headers: { Authorization: `Token ${token}` } }
      );

      alert("Tạo câu hỏi thành công!");

      // reset form
      setTitle("");
      setCategory("");

      // gọi callback reload danh sách
      onSuccess?.();

      // đóng dialog
      onClose();
    } catch (err) {
      console.error("Lỗi khi tạo câu hỏi:", err);
      if (err.response) {
        alert("Backend trả lỗi: " + JSON.stringify(err.response.data));
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-[#1D3557] mb-4">Đặt câu hỏi</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Ví dụ: Thủ tục mua bán đất đai như thế nào?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Chủ đề</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">-- Chọn chủ đề --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi câu hỏi"}
          </button>
        </form>
      </div>
    </div>
  );
}
