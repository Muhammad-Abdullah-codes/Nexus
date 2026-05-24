import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getConversationsForUser } from "../../data/messages";
import { ChatUserList } from "../../components/chat/ChatUserList";
// import { MessageCircle } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const conversations = getConversationsForUser(user.id);

  return (
    <div className="h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in transition-colors duration-200">
      {conversations.length > 0 ? (
        <ChatUserList conversations={conversations} />
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-8">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4 transition-colors">
            {/* <MessageCircle size={32} className="text-gray-400 dark:text-gray-500" /> */}
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">
            No messages yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
            Start connecting with entrepreneurs and investors to begin
            conversations
          </p>
        </div>
      )}
    </div>
  );
};
