import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import instance, { endpoints } from "../configs/Apis";
import { formatDateNow } from "../until/FormatDate";

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await instance.get(endpoints.notifications);
      setNotifications(res.data);
    } catch (err) {
      console.error("Lỗi load thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await instance.patch(`${endpoints.notifications}${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Lỗi đánh dấu đã đọc:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await instance.post(`${endpoints.notifications}mark-all/`);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Lỗi đánh dấu tất cả đã đọc:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading)
    return (
      <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg p-6 text-center">
        <p>Đang tải thông báo...</p>
      </div>
    );

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
      <div className="flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-800 text-lg">Thông báo</h3>
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        {/* Danh sách thông báo */}
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <Link
                key={n.id}
                to={n.link || "#"}
                onClick={() => {
                  if (!n.is_read) markAsRead(n.id);
                  onClose();
                }}
                className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${
                  !n.is_read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={n.actor_avatar || "/default-avatar.png"}
                    alt={n.actor_first_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">
                        {n.actor_first_name} {n.actor_last_name}
                      </span>{" "}
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateNow(n.created_at)}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              Không có thông báo mới
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
            <Link
              to="/notifications"
              onClick={onClose}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
