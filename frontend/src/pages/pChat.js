import React, { useState, useEffect } from "react";
import { FiAlertCircle, FiBookOpen, FiTrash2 } from "react-icons/fi";
import instance, { endpoints } from "../configs/Apis";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function PChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Token ${token}`, "Content-Type": "application/json" };

  // ====================== INIT CHAT ======================
  useEffect(() => {
    const initChat = async () => {
      const token = localStorage.getItem("token");
      if (!token) return alert("Bạn chưa đăng nhập.");

      const headers = { Authorization: `Token ${token}`, "Content-Type": "application/json" };

      try {
        // 1. Lấy danh sách conversation hiện có trước
        const listRes = await instance.get(endpoints.conversations, { headers });
        const allConvs = listRes.data.results;

        // 2. Tạo conversation mới
        const newConvRes = await instance.post(
          endpoints.conversations,
          { title: "Cuộc trò chuyện mới" },
          { headers }
        );
        const newConv = newConvRes.data;

        // 3. Loại bỏ conversation vừa tạo trong list để tránh duplicate
        const filtered = allConvs.filter(c => c.id !== newConv.id);

        // 4. Đặt conversation mới lên đầu
        setConversations([newConv, ...filtered]);
        setActiveConvId(newConv.id);
        setMessages(newConv.messages || []);
      } catch (err) {
        console.error("Lỗi init chat:", err.response?.data || err);
      }
    };

    initChat();
  }, []);



  // ====================== CREATE NEW CONVERSATION ======================
  const createNewConversation = async () => {
    if (!token) return alert("Bạn chưa đăng nhập.");
    try {
      const res = await instance.post(endpoints.conversations, { title: `Cuộc trò chuyện ${conversations.length + 1}` }, { headers });
      const newConv = res.data;
      setConversations([newConv, ...conversations]);
      setActiveConvId(newConv.id);
      setMessages(newConv.turns || []);
    } catch (err) {
      console.error("Lỗi createNewConversation:", err.response?.data || err);
      alert("Tạo conversation thất bại.");
    }
  };

  // ====================== SELECT ======================
  const selectConversation = async (id) => {
    try {
      const res = await instance.get(`/api/chat/conversations/${id}/`, { headers });
      setActiveConvId(id);
      setMessages(res.data.turns || []);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy conversation.");
    }
  };

  // ====================== DELETE ======================
  const deleteConversation = async (id) => {
    try {
      await instance.delete(`/api/chat/conversations/${id}/`, { headers });
      const filtered = conversations.filter(c => c.id !== id);
      setConversations(filtered);

      if (activeConvId === id) {
        if (filtered.length) {
          setActiveConvId(filtered[0].id);
          setMessages(filtered[0].turns || []);
        } else {
          setActiveConvId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Xóa conversation thất bại.");
    }
  };

  // ====================== SEND MESSAGE ======================
  const sendMessage = async () => {
    if (!input.trim() || !activeConvId)
      return alert("Chưa chọn conversation hoặc chưa nhập câu hỏi.");

    const userMsg = { sender: "user", text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await instance.post(
        `/api/chat/chatbot/`,
        {
          query: input.trim(),
          conversation_id: activeConvId,
        },
        { headers }
      );

      console.log("Chatbot response:", res.data);

      const botMsg = {
        sender: "bot",
        text: res.data.answer || "Hệ thống AI chưa trả lời được.",
      };
      setMessages(prev => [...prev, botMsg]);

      // ==== Cập nhật title conversation thành entities ====
      if (res.data.entities) {
        await instance.patch(
          `/api/chat/conversations/${activeConvId}/`,
          { title: res.data.entities },
          { headers }
        );

        // Đồng bộ lại danh sách conversations ở sidebar
        setConversations(prev =>
          prev.map(c =>
            c.id === activeConvId ? { ...c, title: res.data.entities } : c
          )
        );
      }
    } catch (err) {
      console.error("Send error:", err.response?.data || err.message);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Hệ thống AI gặp sự cố. Vui lòng thử lại." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-md border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 px-4 py-5 border-b">
            <img src="/assets/imgs/LogoChu2.png" alt="Logo" className="w-18 h-24" />
            <div className="text-lg font-bold text-[#1D3557]">Tư Vấn Pháp Luật</div>
          </div>

          <div className="px-4 mt-6">
            <div className="text-sm text-gray-500 mb-2">TIỆN ÍCH</div>
            <button
              onClick={createNewConversation}
              className="flex items-center justify-between w-full text-sm px-3 py-2 rounded-md bg-red-100 text-red-600 font-medium"
            >
              <span>+ Cuộc trò chuyện mới</span>
              <span className="text-xs bg-green-600 text-white rounded px-1.5 py-0.5">Mới</span>
            </button>

            {/* Lịch sử */}
            <div className="mt-4 text-sm max-h-48 overflow-y-auto space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${conv.id === activeConvId ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                    }`}
                >
                  <div onClick={() => selectConversation(conv.id)} className="flex-1 truncate">
                    {conv.title}
                  </div>
                  <FiTrash2
                    className="text-gray-400 hover:text-red-500 ml-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 mt-6 text-sm space-y-4 text-[#1D3557]">
            <div className="flex items-center gap-2">Hỗ trợ và góp ý</div>
            <div className="flex items-center gap-2">Cài đặt</div>
            <div className="flex items-center gap-2">Thoát</div>
          </div>
        </div>

        <div className="p-4 text-sm text-red-600 font-semibold">
          Tổng đài hỗ trợ: <br />
          0938 36 1919
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
          <div className="text-sm text-gray-500">Hôm nay</div>
          <div className="flex items-center gap-3">
            <button className="bg-[#1D3557] text-white px-4 py-1.5 rounded-md text-sm font-medium">
              Về trang chủ
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col px-10 py-6 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center mt-16">
              <img src="/assets/imgs/LogoChu2.png" alt="AI" className="w-18 h-24" />
              <h1 className="text-2xl font-semibold mt-4 text-[#1D3557]">
                AI Luật có thể giúp gì cho bạn?
              </h1>
              <div className="flex gap-4 mt-6">
                <button className="border px-4 py-2 rounded-full flex items-center gap-2 text-sm hover:bg-gray-50">
                  <FiAlertCircle /> Hướng dẫn sử dụng AI Luật hiệu quả
                </button>
                <button className="border px-4 py-2 rounded-full flex items-center gap-2 text-sm hover:bg-gray-50">
                  <FiBookOpen /> 33 lĩnh vực AI Luật hỗ trợ{" "}
                  <span className="text-red-500">(mới)</span>
                </button>
              </div>
            </div>
          )}

          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`my-2 flex px-2 ${m.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] ${m.sender === "user"
                    ? "bg-[#1D3557] text-white"
                    : "bg-gray-100 text-gray-800"
                  }`}
              >
                {m.sender === "bot" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="my-1 leading-relaxed" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 space-y-1" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 space-y-1" {...props} />
                      ),
                      li: ({ node, ...props }) => {
                        const children = React.Children.toArray(props.children);
                        return (
                          <li className="leading-relaxed">
                            {children.map((child, i) =>
                              child.type === "p" ? (
                                <span key={i}>{child.props.children}</span>
                              ) : (
                                child
                              )
                            )}
                          </li>
                        );
                      },
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="my-2 flex justify-start">
              <div className="px-4 py-2 rounded-2xl text-sm bg-gray-100 text-gray-600">Đang trả lời...</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-10 py-4 flex items-center bg-white">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Nhập thắc mắc của bạn tại đây..."
              className="w-full pl-4 pr-10 py-3 rounded-full border outline-none text-sm bg-gray-100"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              onClick={sendMessage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 py-2">
          AI Luật đang từng bước hoàn thiện mỗi ngày nên có thể mắc lỗi. Hãy cân nhắc việc kiểm tra
          những thông tin quan trọng.
        </div>
      </div>
    </div>
  );
}
