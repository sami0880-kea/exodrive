export interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  };
  listing: string;
  content: string;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  listing: {
    _id: string;
    title: string;
    images: string[];
    brand: string;
    model: string;
  };
  lastMessage?: Message;
  lastActivity: string;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
}
