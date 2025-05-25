import express from "express";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import {
  generalLimiter,
  messageLimiter,
  strictLimiter,
} from "../middleware/rateLimiter.js";
import emailService from "../utils/emailService.js";

const router = express.Router();

const generateConversationId = (userId1, userId2, listingId) => {
  const sortedUsers = [userId1, userId2].sort();
  return `${sortedUsers[0]}_${sortedUsers[1]}_${listingId}`;
};

router.get("/conversations", generalLimiter, protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name email")
      .populate("listing", "title images brand model")
      .populate("lastMessage")
      .sort({ lastActivity: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/conversations/:conversationId",
  generalLimiter,
  protect,
  async (req, res) => {
    try {
      const { conversationId } = req.params;

      const conversation = await Conversation.findOne({
        conversationId,
        participants: req.user._id,
      });

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messages = await Message.find({ conversationId })
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .sort({ createdAt: 1 });

      await Message.updateMany(
        {
          conversationId,
          receiver: req.user._id,
          isRead: false,
        },
        { isRead: true }
      );

      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post("/send", messageLimiter, protect, async (req, res) => {
  try {
    const { receiverId, listingId, content } = req.body;

    if (!receiverId || !listingId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const listing = await Listing.findById(listingId).populate("user");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({ message: "Cannot message yourself" });
    }

    const conversationId = generateConversationId(
      req.user._id,
      receiverId,
      listingId
    );

    let conversation = await Conversation.findOne({ conversationId });
    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, receiverId],
        listing: listingId,
        conversationId,
        lastActivity: new Date(),
      });
    } else {
      conversation.lastActivity = new Date();
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      listing: listingId,
      content,
      conversationId,
    });

    await message.save();
    conversation.lastMessage = message._id;
    await conversation.save();

    await message.populate("sender", "name email");
    await message.populate("receiver", "name email");

    const io = req.app.get("io");
    if (io) {
      io.to(`user_${receiverId}`).emit("newMessage", message);
      io.to(`user_${req.user._id}`).emit("messageSent", message);
    }
    try {
      await emailService.sendNewMessageNotification({
        recipientEmail: receiver.email,
        recipientName: receiver.name,
        senderName: req.user.name,
        listingTitle: listing.title,
        messageContent: content,
        listingId: listingId,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/mark-read/:conversationId",
  generalLimiter,
  protect,
  async (req, res) => {
    try {
      const { conversationId } = req.params;

      await Message.updateMany(
        {
          conversationId,
          receiver: req.user._id,
          isRead: false,
        },
        { isRead: true }
      );

      res.json({ message: "Messages marked as read" });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/unread-count", generalLimiter, protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });

    res.json({ count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
