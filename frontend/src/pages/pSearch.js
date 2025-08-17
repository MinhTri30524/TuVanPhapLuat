import React from 'react';
import CpHeader from '../components/cpHeader';
import CpFooter from '../components/cpFooter';

function PSearch() {
    return (
        <React.Fragment>
            <CpHeader />
            <div className="bg-gray-100 text-gray-800 min-h-screen py-20">
                <section className="bg-white py-5 px-6 shadow-md">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4">
                        <input
                            type="text"
                            placeholder="Nhập nội dung cần tìm..."
                            className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457B9D]"
                        />
                        <button className="bg-[#1D3557] hover:bg-[#457B9D] text-white px-6 py-2 rounded-lg font-semibold">
                            🔍 Tìm kiếm 
                        </button>
                    </div>

                    <div className="max-w-6xl mx-auto mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-700">
                        <label><input type="radio" name="search" defaultChecked /> Tất cả</label>
                        <label><input type="radio" name="search" /> Tiêu đề</label>
                        <label><input type="radio" name="search" /> Số hiệu văn bản</label>
                        <label><input type="checkbox" /> Cụm từ chính xác</label>
                        <a href="/" className="text-[#1D3557] underline">Tìm nâng cao</a>
                    </div>
                </section>
                <main className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <aside className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 text-[#1D3557]">Tra cứu nhanh</h2>

                        <div className="mb-6">
                            <p className="font-medium">Nhóm văn bản</p>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li><input type="checkbox" /> Công văn</li>
                                <li><input type="checkbox" /> Văn bản UBND</li>
                                <li><input type="checkbox" /> Văn bản pháp quy</li>
                                <li><input type="checkbox" /> Tiêu chuẩn VN</li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-medium">Lĩnh vực</p>
                            <input
                                type="text"
                                placeholder="Tìm lĩnh vực..."
                                className="w-full border border-gray-300 px-2 py-1 rounded"
                            />
                        </div>
                    </aside>

                    <section className="md:col-span-3 bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold text-[#1D3557] mb-4">Kết quả tìm kiếm</h2>
                        <p className="text-gray-600 italic">Chưa có kết quả nào, hãy nhập từ khóa để bắt đầu tra cứu.</p>
                    </section>
                </main>
            </div>

            <CpFooter />
        </React.Fragment>
    )

}
export default PSearch;