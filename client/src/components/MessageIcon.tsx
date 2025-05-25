import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

interface MessageIconProps {
  isDarkText: boolean;
}

const MessageIcon: React.FC<MessageIconProps> = ({ isDarkText }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", () => {
        fetchUnreadCount();
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/messages/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleClick = () => {
    navigate("/messages");
  };

  if (!user) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 rounded-lg transition-colors ${
        !isDarkText
          ? "hover:bg-gray-100 text-gray-900"
          : "hover:bg-white/10 text-white"
      }`}
    >
      <MessageCircle
        size={20}
        className={!isDarkText ? "text-gray-900" : "text-white"}
      />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default MessageIcon;
