import React, { useState, useEffect } from "react";
import instance, { endpoints } from "../configs/Apis";

export default function AdminDashboard() {
  const [route, setRoute] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex">
        <Sidebar route={route} setRoute={setRoute} />
        <main className="flex-1 p-6">
          <Topbar />

          <div className="mt-6">
            {route === "dashboard" && <Dashboard />}
            {route === "documents" && <DocumentsManager />}
            {route === "news" && <NewsManager />}
            {route === "categories" && <CategoriesManager />}
            {route === "stats" && <Statistics />}
            {route === "chatbot" && <ChatbotStats />}
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ route, setRoute }) {
  const menu = [
    { id: "dashboard", label: "Dashboard" },
    { id: "documents", label: "Quản lý văn bản" },
    { id: "news", label: "Quản lý tin tức" },
    { id: "categories", label: "Quản lý danh mục" },
    { id: "stats", label: "Thống kê" },
    { id: "chatbot", label: "Thống kê Chatbot" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-semibold">Admin - Hệ chuyên gia pháp luật</h1>
        <p className="text-sm text-gray-500 mt-1">Quản trị hệ thống</p>
      </div>

      <nav className="px-2 py-4">
        {menu.map((m) => (
          <button
            key={m.id}
            onClick={() => setRoute(m.id)}
            className={`w-full text-left px-4 py-2 rounded-md mb-1 hover:bg-gray-50 transition-colors flex items-center ${
              route === m.id ? "bg-indigo-50 border-l-4 border-indigo-500" : ""
            }`}
          >
            <span className="ml-2">{m.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-6 text-xs text-gray-500">
        <div>API: Django backend</div>
        <div className="mt-2">AI: NLP service / OpenAI / local model</div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm">
      <div>
        <h2 className="text-lg font-medium">Bảng điều khiển</h2>
        <p className="text-sm text-gray-500">Quản lý nội dung, danh mục và thống kê</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">Xin chào, Admin</div>
        <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm">Logout</button>
      </div>
    </div>
  );
}

// -------------------- Dashboard --------------------
function Dashboard() {
  const [summary, setSummary] = useState({
    documents: 0,
    news: 0,
    categories: 0,
    chatbotQueries: 0,
  });

  useEffect(() => {
    async function fetchSummary() {
      try {
        const [docs, news, cats] = await Promise.all([
          instance.get(endpoints.documents),
          instance.get(endpoints.news),
          instance.get(endpoints.categories),
        ]);
        setSummary({
          documents: docs.data.count || 0,
          news: news.data.length || 0,
          categories: cats.data.count || 0,
          chatbotQueries: 234, // TODO: thay bằng API thống kê chatbot
        });
      } catch (err) {
        console.error("❌ Lỗi load summary:", err);
      }
    }
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Văn bản luật" value={summary.documents} />
        <Card title="Tin tức" value={summary.news} />
        <Card title="Danh mục" value={summary.categories} />
        <Card title="Lượt sử dụng Chatbot" value={summary.chatbotQueries} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-md shadow flex flex-col">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

// -------------------- Documents Manager --------------------
function DocumentsManager() {
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState([]);
  const [editing, setEditing] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDocuments();
  }, [page]);

  async function fetchDocuments() {
    try {
      const res = await instance.get(endpoints.documents, {
        params: { page, search: query || undefined },
      });
      setDocs(res.data.results || []);
      setTotalPages(Math.ceil(res.data.count / 10)); // giả sử page_size=10
    } catch (err) {
      console.error("❌ Lỗi load documents:", err);
    }
  }

  async function onSave(updated) {
    try {
      if (updated.id) {
        await instance.put(endpoints.documentDetail(updated.id), updated);
      } else {
        await instance.post(endpoints.documents, updated);
      }
      fetchDocuments();
      setEditing(null);
    } catch (err) {
      console.error("❌ Lỗi lưu document:", err);
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Xóa văn bản?")) return;
    try {
      await instance.delete(endpoints.documentDetail(id));
      fetchDocuments();
    } catch (err) {
      console.error("❌ Lỗi xóa document:", err);
    }
  }

  return (
    <div className="bg-white rounded-md shadow p-4">
      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tiêu đề"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={() => {
            setPage(1);
            fetchDocuments();
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Tìm
        </button>
        <button
          onClick={() => setEditing({ title: "", summary: "", category: "" })}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Thêm mới
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="text-gray-500">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Tiêu đề</th>
            <th className="p-2">Danh mục</th>
            <th className="p-2">Ngày ban hành</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.id}</td>
              <td className="p-2">{d.title}</td>
              <td className="p-2">{d.category?.name}</td>
              <td className="p-2">{d.issued_date}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => setEditing(d)}
                  className="px-2 py-1 bg-yellow-400 rounded-sm text-xs"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(d.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded-sm text-xs"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {editing && (
        <DocumentEditor
          doc={editing}
          onSave={onSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function DocumentEditor({ doc, onSave, onCancel }) {
  const [form, setForm] = useState({ ...doc });

  function save() {
    if (!form.title) return alert("Tiêu đề không được trống");
    onSave(form);
  }

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-md border">
      <h4 className="font-medium mb-2">
        {doc.id ? "Sửa văn bản" : "Thêm văn bản mới"}
      </h4>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        value={form.title}
        onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
        placeholder="Tiêu đề"
      />
      <textarea
        className="w-full border rounded px-3 py-2 mb-2"
        value={form.summary}
        onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
        placeholder="Tóm tắt"
      />
      <div className="flex gap-2">
        <button
          onClick={save}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Lưu
        </button>
        <button onClick={onCancel} className="px-4 py-2 border rounded-md">
          Hủy
        </button>
      </div>
    </div>
  );
}

// -------------------- News Manager --------------------
function NewsManager() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const res = await instance.get(endpoints.news);
      setNews(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi load news:", err);
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Xóa tin tức?")) return;
    try {
      await instance.delete(endpoints.newsDetail(id));
      fetchNews();
    } catch (err) {
      console.error("❌ Lỗi xóa news:", err);
    }
  }

  return (
    <div className="bg-white rounded-md shadow p-4">
      <h3 className="font-medium mb-3">Quản lý tin tức</h3>
      <div className="space-y-3">
        {news.map((n) => (
          <div key={n.id} className="border rounded p-3">
            <div className="flex justify-between">
              <h4 className="font-semibold">{n.title}</h4>
              <button
                onClick={() => onDelete(n.id)}
                className="px-2 py-1 bg-red-500 text-white rounded-sm text-xs"
              >
                Xóa
              </button>
            </div>
            <p className="text-sm mt-1">{n.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------- Categories Manager --------------------
function CategoriesManager() {
  const [cats, setCats] = useState([]);
  const [newCat, setNewCat] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, [page]);

  async function fetchCategories() {
    try {
      const res = await instance.get(endpoints.categories, { params: { page } });
      setCats(res.data.results || []);
      setTotalPages(Math.ceil(res.data.count / 10)); // giả sử page_size=10
    } catch (err) {
      console.error("❌ Lỗi load categories:", err);
    }
  }

  async function add() {
    if (!newCat) return;
    try {
      const res = await instance.post(endpoints.categories, { name: newCat });
      setNewCat("");
      fetchCategories();
    } catch (err) {
      console.error("❌ Lỗi thêm category:", err);
    }
  }

  async function remove(id) {
    if (!window.confirm("Xóa danh mục?")) return;
    try {
      await instance.delete(endpoints.categoryDetail(id));
      fetchCategories();
    } catch (err) {
      console.error("❌ Lỗi xóa category:", err);
    }
  }

  return (
    <div className="bg-white rounded-md shadow p-4">
      <h3 className="font-medium mb-3">Quản lý danh mục</h3>
      <div className="flex gap-2 mb-4">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Tên danh mục"
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Thêm
        </button>
      </div>
      <ul className="space-y-2">
        {cats.map((c) => (
          <li
            key={c.id}
            className="flex justify-between border rounded px-3 py-2"
          >
            {c.name}
            <button onClick={() => remove(c.id)} className="text-red-500 text-sm">
              Xóa
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// -------------------- Statistics --------------------
function Statistics() {
  return (
    <div className="bg-white rounded-md shadow p-4">
      <h3 className="font-medium mb-3">Thống kê hệ thống</h3>
      <div className="h-48 flex items-center justify-center text-gray-400">
        [Biểu đồ thống kê - TODO]
      </div>
    </div>
  );
}

// -------------------- Chatbot Stats --------------------
function ChatbotStats() {
  return (
    <div className="bg-white rounded-md shadow p-4">
      <h3 className="font-medium">Thống kê Chatbot</h3>
      <div className="h-48 flex items-center justify-center text-gray-400">
        [Biểu đồ chatbot - TODO]
      </div>
    </div>
  );
}
