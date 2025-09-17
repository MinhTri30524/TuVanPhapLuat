import React, { useState, useEffect } from "react";
import { FaSearch, FaFileAlt, FaNewspaper, FaCalendarAlt } from "react-icons/fa";
import CpHeader from "../components/cpHeader";
import CpFooter from "../components/cpFooter";
import instance, { endpoints } from "../configs/Apis";
import { useNavigate } from "react-router-dom";

const toSlug = (str = "") =>
    str
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

let typingTimeout;

function PSearch() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [docs, setDocs] = useState([]);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    // 🔹 Gọi API gợi ý khi người dùng nhập
    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }
        // clear debounce
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(async () => {
            try {
                const [docRes, newsRes] = await Promise.all([
                    instance.get(endpoints.documents, { params: { search: query, page_size: 5 } }),
                    instance.get(endpoints.news, { params: { search: query, page_size: 5 } }),
                ]);
                const docList = docRes.data.results || docRes.data;
                const newsList = newsRes.data.results || newsRes.data;

                // hợp nhất để gợi ý
                const merged = [
                    ...docList.map((d) => ({ type: "doc", id: d.id, title: d.title })),
                    ...newsList.map((n) => ({ type: "news", id: n.id, title: n.title })),
                ];
                setSuggestions(merged);
            } catch (e) {
                console.error("Lỗi gợi ý:", e);
            }
        }, 400); // debounce 400ms
    }, [query]);

    // 🔹 Nhấn tìm kiếm: lấy toàn bộ kết quả
    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const [docRes, newsRes] = await Promise.all([
                instance.get(endpoints.documents, { params: { search: query } }),
                instance.get(endpoints.news, { params: { search: query } }),
            ]);
            setDocs(docRes.data.results || docRes.data);
            setNews(newsRes.data.results || newsRes.data);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <CpHeader />
            <div className="bg-gray-100 text-gray-800 min-h-screen py-20">
                {/* THANH TÌM KIẾM */}
                <section className="bg-white py-5 px-6 shadow-md relative">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Nhập nội dung cần tìm..."
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457B9D]"
                            />
                            {/* GỢI Ý */}
                            {suggestions.length > 0 && (
                                <ul className="absolute z-10 bg-white border border-gray-200 mt-1 rounded-lg shadow w-full max-h-60 overflow-y-auto">
                                    {suggestions.map((s, i) => (
                                        <li
                                            key={i}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
                                            onClick={() => {
                                                setQuery(s.title);
                                                setSuggestions([]);
                                                handleSearch();
                                            }}
                                        >
                                            {s.type === "doc" ? (
                                                <FaFileAlt className="text-[#457B9D]" />
                                            ) : (
                                                <FaNewspaper className="text-[#E63946]" />
                                            )}
                                            {s.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="flex items-center gap-2 bg-[#1D3557] hover:bg-[#457B9D] text-white px-6 py-2 rounded-lg font-semibold"
                        >
                            <FaSearch /> Tìm kiếm
                        </button>
                    </div>
                </section>

                {/* KẾT QUẢ */}
                <main className="max-w-6xl mx-auto py-8 px-4 space-y-10">
                    {loading && <p className="italic text-gray-500">Đang tải...</p>}

                    {/* KẾT QUẢ VĂN BẢN */}
                    {!loading && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold text-[#1D3557] mb-4 flex items-center gap-2">
                                <FaFileAlt /> Văn bản pháp luật
                            </h2>
                            {docs.length ? (
                                <ul className="space-y-3">
                                    {docs.map((d) => (
                                        <li
                                            key={d.id}
                                            onClick={() =>
                                                navigate(`/vanban/${toSlug(d.title)}/${d.id}`)
                                            }
                                            className="block w-full p-3 border rounded-lg cursor-pointer 
                   hover:bg-gray-100 hover:shadow transition"
                                        >
                                            <h3 className="font-semibold">{d.title}</h3>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <FaCalendarAlt /> {d.issued_date || "—"}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="italic text-gray-500">Không có kết quả văn bản.</p>
                            )}
                        </div>
                    )}

                    {/* KẾT QUẢ TIN TỨC */}
                    {!loading && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold text-[#1D3557] mb-4 flex items-center gap-2">
                                <FaNewspaper /> Tin tức pháp luật
                            </h2>
                            {news.length ? (
                                <ul className="space-y-3">
                                    {news.map((n) => (
                                        <li
                                            key={n.id}
                                            onClick={() =>
                                                navigate(`/tintuc/${toSlug(n.title)}/${n.id}`)
                                            }
                                            className="block w-full p-3 border rounded-lg cursor-pointer 
                   hover:bg-gray-100 hover:shadow transition"
                                        >
                                            <h3 className="font-semibold">{n.title}</h3>
                                            <p className="text-sm text-gray-600">{n.summary || ""}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="italic text-gray-500">Không có tin tức.</p>
                            )}
                        </div>
                    )}
                </main>
            </div>
            <CpFooter />
        </React.Fragment>
    );
}

export default PSearch;
