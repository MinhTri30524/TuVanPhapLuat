import React, { useState } from "react";
import CpHeader from '../components/cpHeader';
import CpFooter from '../components/cpFooter';
import CpScrollToTop from '../components/cpScrollToTop';
import { useNavigate } from "react-router-dom";

function PDocument() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    type: "",
    status: "",
    agency: ""
  });

  const [documents] = useState([
    {
      id: 1,
      title: "Quyết định 05/2025/QĐ-UBND của UBND tỉnh Quảng Trị",
      type: "Quyết định",
      agency: "UBND Quảng Trị",
      date: "15/08/2025",
      updated: "15/08/2025"
    },
    {
      id: 2,
      title: "Quyết định 573/QĐ-UBND của UBND tỉnh Hưng Yên",
      type: "Quyết định",
      agency: "UBND Hưng Yên",
      date: "15/08/2025",
      updated: "15/08/2025"
    }
    // Thêm dữ liệu mẫu khác...
  ]);

  // Lọc dữ liệu
  const filteredDocs = documents.filter((doc) => {
    return (
      doc.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter.type === "" || doc.type === filter.type) &&
      (filter.agency === "" || doc.agency === filter.agency)
    );
  });

  return (
    <React.Fragment>
      <CpHeader />
      <div className="p-12 bg-gray-50 min-h-screen">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold mb-4">Văn bản mới - Văn bản pháp luật</h1>

        {/* Thanh tìm kiếm */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Nhập nội dung cần tìm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <button className="bg-red-600 text-white px-4 py-1 rounded-lg">Tìm kiếm</button>
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
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">-- Tình trạng hiệu lực --</option>
            <option value="Còn hiệu lực">Còn hiệu lực</option>
            <option value="Hết hiệu lực">Hết hiệu lực</option>
          </select>

          <select
            value={filter.agency}
            onChange={(e) => setFilter({ ...filter, agency: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="">-- Cơ quan ban hành --</option>
            <option value="UBND Quảng Trị">UBND Quảng Trị</option>
            <option value="UBND Hưng Yên">UBND Hưng Yên</option>
          </select>
        </div>

        {/* Danh sách văn bản */}
        <table className="w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">STT</th>
              <th className="p-2 border">Tiêu đề</th>
              <th className="p-2 border">Loại VB</th>
              <th className="p-2 border">Cơ quan ban hành</th>
              <th className="p-2 border">Ngày ban hành</th>
              <th className="p-2 border">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc, index) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/vanban/chitiet')}>
                  {doc.title}
                </td>
                <td className="p-2 border text-center">{doc.type}</td>
                <td className="p-2 border text-center">{doc.agency}</td>
                <td className="p-2 border text-center">{doc.date}</td>
                <td className="p-2 border text-center">{doc.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang (demo tĩnh) */}
        <div className="flex justify-center gap-2 mt-4">
          <button className="px-3 py-1 border rounded-lg">1</button>
          <button className="px-3 py-1 border rounded-lg">2</button>
          <button className="px-3 py-1 border rounded-lg">3</button>
        </div>
      </div>
      <CpScrollToTop />
      <CpFooter />
    </React.Fragment>
  );
}

export default PDocument;
