import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ConsultationDialog({ open, onClose, consultation }) {
    if (!open || !consultation) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-3/4 max-w-2xl p-6 rounded-xl shadow-lg relative">
                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                {/* Nội dung */}
                <h2 className="text-xl font-bold text-[#1D3557] mb-2">
                    {consultation.question_title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    #{consultation.question_id} - {consultation.category?.name} -{" "}
                    {consultation.asked_date || "—"}
                </p>

                <div className="prose max-w-none max-h-96 overflow-y-auto pr-2">
                    {consultation.answer ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {consultation.answer}
                        </ReactMarkdown>
                    ) : (
                        <p className="text-gray-400 italic">Chưa có câu trả lời</p>
                    )}
                </div>

            </div>
        </div>
    );
}
