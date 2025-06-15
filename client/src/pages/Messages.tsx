import React, { useState, useEffect } from "react";
import { Card, Heading, Text } from "@radix-ui/themes";
import { MessageCircle, Send, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import axios from "axios";
import config from "../config";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import ContentPage from "../components/ContentPage";
import Button from "../components/Button";
import { Conversation, Message } from "../types/message";

const Messages: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message: Message) => {
        if (
          selectedConversation &&
          message.conversationId === selectedConversation.conversationId
        ) {
          setMessages((prev) => [...prev, message]);
        }
        fetchConversations();
      });

      socket.on("messageSent", (message: Message) => {
        if (
          selectedConversation &&
          message.conversationId === selectedConversation.conversationId
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });

      return () => {
        socket.off("newMessage");
        socket.off("messageSent");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/messages/conversations`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversation: Conversation) => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/messages/conversations/${conversation.conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setMessages(response.data);
      setSelectedConversation(conversation);

      if (socket) {
        socket.emit("joinConversation", conversation.conversationId);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSendingMessage(true);
    try {
      const otherParticipant = selectedConversation.participants.find(
        (p) => p._id !== user._id
      );

      await axios.post(
        `${config.apiUrl}/messages/send`,
        {
          receiverId: otherParticipant?._id,
          listingId: selectedConversation.listing._id,
          content: newMessage.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p._id !== user?._id);
  };

  if (!user) {
    return (
      <ContentPage>
        <div className="max-w-4xl mx-auto px-4 text-center py-12">
          <Heading size="8" className="mb-4">
            Log ind for at se dine beskeder
          </Heading>
          <Text size="4" className="text-gray-600">
            Du skal være logget ind for at se dine beskeder.
          </Text>
        </div>
      </ContentPage>
    );
  }

  if (loading) {
    return (
      <ContentPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Text>Loading...</Text>
        </div>
      </ContentPage>
    );
  }

  return (
    <ContentPage>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Heading size="8" className="mb-6">
          Mine Beskeder
        </Heading>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <Card className="p-4 overflow-y-auto">
            <Heading size="4" className="mb-4">
              Samtaler
            </Heading>
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <Text className="text-gray-600">Ingen beskeder endnu</Text>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(conversation);
                  return (
                    <div
                      key={conversation._id}
                      onClick={() => fetchMessages(conversation)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?._id === conversation._id
                          ? "bg-red-50 border border-red-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {conversation.listing.images &&
                          conversation.listing.images.length > 0 ? (
                            <img
                              src={conversation.listing.images[0]}
                              alt={`${conversation.listing.brand} ${conversation.listing.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Text className="font-medium text-gray-700">
                              {otherParticipant?.name.charAt(0).toUpperCase()}
                            </Text>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <Text className="font-medium truncate">
                              {otherParticipant?.name}
                            </Text>
                            <Text
                              size="1"
                              className="text-gray-500 flex-shrink-0"
                            >
                              {formatDistanceToNow(
                                new Date(conversation.lastActivity),
                                {
                                  addSuffix: true,
                                  locale: da,
                                }
                              )}
                            </Text>
                          </div>
                          <div className="flex items-center justify-between space-y-0">
                            <div>
                              <Text
                                size="2"
                                className="text-gray-600 truncate block font-medium"
                              >
                                {conversation.listing.brand}{" "}
                                {conversation.listing.model}
                              </Text>
                              {conversation.lastMessage && (
                                <Text
                                  size="1"
                                  className="text-gray-500 truncate block"
                                >
                                  {conversation.lastMessage.content}
                                </Text>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="lg:col-span-2 p-4 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {selectedConversation.listing.images &&
                      selectedConversation.listing.images.length > 0 ? (
                        <img
                          src={selectedConversation.listing.images[0]}
                          alt={`${selectedConversation.listing.brand} ${selectedConversation.listing.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Text className="font-medium text-gray-700">
                          {getOtherParticipant(selectedConversation)
                            ?.name.charAt(0)
                            .toUpperCase()}
                        </Text>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Text className="font-medium block">
                          {getOtherParticipant(selectedConversation)?.name}
                        </Text>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/listings/${selectedConversation.listing._id}`
                            )
                          }
                          className="ml-2 whitespace-nowrap !border-gray-300 !text-gray-900 hover:!bg-gray-100 hover:!border-gray-400 hover:!text-gray-900"
                        >
                          <div className="flex items-center gap-1">
                            <ExternalLink size={14} />
                            <span>Gå til annonce</span>
                          </div>
                        </Button>
                      </div>
                      <Text size="2" className="text-gray-600 block">
                        {selectedConversation.listing.brand}{" "}
                        {selectedConversation.listing.model}
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender._id === user._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender._id === user._id
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <Text size="2">{message.content}</Text>
                        <Text
                          size="1"
                          className={`block mt-1 ${
                            message.sender._id === user._id
                              ? "text-red-100"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString(
                            "da-DK",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Skriv en besked..."
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    disabled={sendingMessage}
                  />
                  <Button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                  >
                    <div className="flex items-center gap-2">
                      <Send size={16} />
                      <span>Send</span>
                    </div>
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle
                    size={48}
                    className="mx-auto text-gray-400 mb-4"
                  />
                  <Text className="text-gray-600">
                    Vælg en samtale for at se beskeder
                  </Text>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ContentPage>
  );
};

export default Messages;
