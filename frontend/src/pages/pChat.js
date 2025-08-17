import React from "react";
import { FiAlertCircle, FiBookOpen } from "react-icons/fi";

function PChat() {
    return (
        <div className="flex h-screen bg-gray-50">
            <div className="w-72 bg-white shadow-md border-r border-gray-200 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 px-4 py-5 border-b">
                        <img src="/assets/imgs/LogoChu2.png" alt="Logo" className="w-18 h-24" />
                        <div className="text-lg font-bold text-[#1D3557]">Tư Vấn Pháp Luật</div>
                    </div>

                    <div className="px-4 mt-6">
                        <div className="text-sm text-gray-500 mb-2">TIỆN ÍCH</div>
                        <button className="flex items-center justify-between w-full text-sm px-3 py-2 rounded-md bg-red-100 text-red-600 font-medium">
                            <span>Trợ lý AI Luật</span>
                            <span className="text-xs bg-green-600 text-white rounded px-1.5 py-0.5">Mới</span>
                        </button>
                    </div>

                    <div className="px-4 mt-6 text-sm space-y-4 text-[#1D3557]">
                        <div className="flex items-center gap-2">
                            <span>💬</span> Hỗ trợ và góp ý
                        </div>
                        <div className="flex items-center gap-2">
                            <span>⚙️</span> Cài đặt
                        </div>
                        <div className="flex items-center gap-2">
                            <span>🚪</span> Thoát
                        </div>
                    </div>
                </div>

                <div className="p-4 text-sm text-red-600 font-semibold">
                    Tổng đài hỗ trợ: <br />
                    0938 36 1919
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-white">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
                    <div className="text-sm text-gray-500">
                        Chủ Nhật, 03 tháng 08, 2025
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-[#1D3557] text-white px-4 py-1.5 rounded-md text-sm font-medium">
                            Về trang chủ
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gray-300" />
                    </div>
                </div>

                <div className="flex-1 flex px-10 py-8 gap-6">
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <img src="/assets/imgs/LogoChu2.png" alt="AI" className="w-18 h-24" />
                        <h1 className="text-2xl font-semibold mt-4 text-[#1D3557]">
                            AI Luật có thể giúp gì cho bạn?
                        </h1>
                        <div className="flex gap-4 mt-6">
                            <button className="border px-4 py-2 rounded-full flex items-center gap-2 text-sm hover:bg-gray-50">
                                <FiAlertCircle /> Hướng dẫn sử dụng AI Luật hiệu quả
                            </button>
                            <button className="border px-4 py-2 rounded-full flex items-center gap-2 text-sm hover:bg-gray-50">
                                <FiBookOpen /> 33 lĩnh vực AI Luật hỗ trợ <span className="text-red-500">(mới)</span>
                            </button>
                        </div>
                    </div>

                    <div className="w-72 flex flex-col bg-gray-100 border">
                        <div className="flex items-center justify-between px-4 py-3 border-b text-sm font-semibold text-[#1D3557]">
                            <span>Gần đây</span>
                            <button className="bg-[#EAF1FB] text-[#1D3557] px-3 py-1 rounded-full text-xs hover:bg-[#d6e7fb] transition">
                                + Cuộc trò chuyện mới
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-500">
                            Chưa có lịch sử trò chuyện
                        </div>
                    </div>

                </div>

                <div className="px-10 py-4 flex items-center bg-white w-[780px]">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Nhập thắc mắc của bạn tại đây..."
                            className="w-full pl-4 pr-10 py-3 rounded-full border outline-none text-sm bg-gray-100"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer"
                        >
                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                    </div>
                </div>


                <div className="text-center text-xs text-gray-500 py-2">
                    AI Luật đang từng bước hoàn thiện mỗi ngày nên có thể mắc lỗi. Hãy cân nhắc việc kiểm tra những thông tin quan trọng.
                </div>

            </div>
        </div>
    );
}
export default PChat;