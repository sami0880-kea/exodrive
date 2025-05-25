import { Router } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { authLimiter, generalLimiter } from "../middleware/rateLimiter.js";
import emailService from "../utils/emailService.js";

const router = Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

router.post(
  "/register",
  authLimiter,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).send({ message: "User already exists" });
      }

      user = await User.create({
        name,
        email,
        password,
      });

      const token = generateToken(user._id);

      try {
        await emailService.sendWelcomeEmail({
          email: user.email,
          name: user.name,
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }

      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  }
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      const token = generateToken(user._id);

      res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  }
);

export default router;
