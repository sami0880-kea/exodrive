import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Card, Heading, Text } from "@radix-ui/themes";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import config from "../config";

interface MessageButtonProps {
  sellerId: string;
  sellerName: string;
  listingId: string;
  listingTitle: string;
}

const MessageButton: React.FC<MessageButtonProps> = ({
  sellerId,
  sellerName,
  listingId,
  listingTitle,
}) => {
  const { user } = useAuth();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      await axios.post(
        `${config.apiUrl}/messages/send`,
        {
          receiverId: sellerId,
          listingId,
          content: message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSuccess(true);
      setMessage("");
      setTimeout(() => {
        setShowMessageForm(false);
        setSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to send message. Please try again."
        );
      } else {
        setError("Failed to send message. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user._id === sellerId) {
    return null;
  }

  if (showMessageForm) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading size="4">Send besked til {sellerName}</Heading>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMessageForm(false)}
              className="!border-gray-300 !text-gray-900 hover:!bg-gray-100 hover:!border-gray-400 hover:!text-gray-900"
            >
              Annuller
            </Button>
          </div>

          <Text size="2" className="text-gray-600">
            Angående: {listingTitle}
          </Text>

          {success ? (
            <div className="text-center py-4">
              <div className="text-green-600 font-medium mb-2">
                ✓ Besked sendt!
              </div>
              <Text size="2" className="text-gray-600">
                Du kan se dine beskeder i din profil
              </Text>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Skriv din besked her..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  rows={4}
                  required
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading || !message.trim()}>
                  <div className="flex items-center gap-2">
                    <Send size={16} />
                    <span>{isLoading ? "Sender..." : "Send besked"}</span>
                  </div>
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Button
      onClick={() => setShowMessageForm(true)}
      className="w-full"
      size="lg"
    >
      <div className="flex items-center justify-center gap-2">
        <MessageCircle size={20} />
        <span>Kontakt sælger</span>
      </div>
    </Button>
  );
};

export default MessageButton;
