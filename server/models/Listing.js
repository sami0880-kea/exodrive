import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  withVAT: {
    type: Boolean,
    default: true,
  },
  withRegistrationFee: {
    type: Boolean,
    default: true,
  },
  fuelType: {
    type: String,
    enum: ["diesel", "benzin", "el", "plug-in-diesel", "plug-in-benzin"],
    required: true,
  },
  version: {
    type: String,
    enum: ["sedan", "coupe", "saloon", "suv", "cuv"],
    required: true,
  },
  transmission: {
    type: String,
    enum: ["automatic", "manual"],
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  listingType: {
    type: String,
    enum: ["direct-sale", "no-tax", "lease"],
    required: true,
  },
  leaseDetails: {
    downPayment: Number,
    monthlyPayment: Number,
    duration: {
      type: Number,
      enum: [6, 12, 24, 36],
    },
    remainingMonths: Number,
    residualValue: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
