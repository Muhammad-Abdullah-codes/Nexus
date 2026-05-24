import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Send, Phone, Video, Info, Smile, MessageCircle } from "lucide-react";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ChatMessage } from "../../components/chat/ChatMessage";
import { ChatUserList } from "../../components/chat/ChatUserList";
import { VideoCallOverlay } from "../../components/chat/VideoCallOverlay"; // Import the WebRTC component
import { useAuth } from "../../context/AuthContext";
import { Message } from "../../types";
import { findUserById } from "../../data/users";
import {
  getMessagesBetweenUsers,
  sendMessage,
  getConversationsForUser,
} from "../../data/messages";

export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);

  // State for WebRTC Video Call
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const chatPartner = userId ? findUserById(userId) : null;

  useEffect(() => {
    // Load conversations
    if (currentUser) {
      setConversations(getConversationsForUser(currentUser.id));
    }
  }, [currentUser]);

  useEffect(() => {
    // Load messages between users
    if (currentUser && userId) {
      setMessages(getMessagesBetweenUsers(currentUser.id, userId));
    }
  }, [currentUser, userId]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentUser || !userId) return;

    const message = sendMessage({
      senderId: currentUser.id,
      receiverId: userId,
      content: newMessage,
    });

    setMessages([...messages, message]);
    setNewMessage("");

    // Update conversations
    setConversations(getConversationsForUser(currentUser.id));
  };

  if (!currentUser) return null;

  return (
    <>
      {/* WebRTC Video Call Overlay */}
      {isVideoCallActive && chatPartner && (
        <VideoCallOverlay
          partner={chatPartner}
          onClose={() => setIsVideoCallActive(false)}
        />
      )}

      <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden animate-fade-in transition-colors duration-200">
        {/* Conversations sidebar */}
        <div className="hidden md:block w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-800 transition-colors">
          <ChatUserList conversations={conversations} />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          {chatPartner ? (
            <>
              <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center transition-colors">
                <div className="flex items-center">
                  <Avatar
                    src={chatPartner.avatarUrl}
                    alt={chatPartner.name}
                    size="md"
                    status={chatPartner.isOnline ? "online" : "offline"}
                    className="mr-3"
                  />

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {chatPartner.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {chatPartner.isOnline ? "Online" : "Last seen recently"}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-2"
                    aria-label="Voice call"
                  >
                    <Phone size={18} />
                  </Button>

                  {/* Start Video Call Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                    aria-label="Start Video Call"
                    onClick={() => setIsVideoCallActive(true)}
                  >
                    <Video size={18} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-2"
                    aria-label="Info"
                  >
                    <Info size={18} />
                  </Button>
                </div>
              </div>

              {/* Messages container */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isCurrentUser={message.senderId === currentUser.id}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4 transition-colors">
                      <MessageCircle
                        size={32}
                        className="text-gray-400 dark:text-gray-500"
                      />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      No messages yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Send a message to start the conversation
                    </p>
                  </div>
                )}
              </div>

              {/* Message input */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4 transition-colors">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-2"
                    aria-label="Add emoji"
                  >
                    <Smile size={20} />
                  </Button>

                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    fullWidth
                    className="flex-1"
                  />

                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newMessage.trim()}
                    className="rounded-full p-2 w-10 h-10 flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4 transition-colors">
                <MessageCircle
                  size={48}
                  className="text-gray-400 dark:text-gray-500"
                />
              </div>
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Select a conversation
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                Choose a contact from the list to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
