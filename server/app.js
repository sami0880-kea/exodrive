import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/connection.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listing.js";

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port`, PORT));
