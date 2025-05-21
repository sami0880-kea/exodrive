import { Router } from "express";
import Listing from "../models/Listing.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post("/", upload.array("images", 6), async (req, res) => {
  try {
    const listingData = JSON.parse(req.body.listingData);
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).send({ message: "No images provided" });
    }

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        try {
          return await uploadToCloudinary(file);
        } catch (error) {
          console.error("Error uploading file to Cloudinary:", error);
          throw error;
        }
      })
    );

    const listing = new Listing({
      ...listingData,
      images: imageUrls,
    });

    await listing.save();
    res.status(201).send(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(400).send({ message: error.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const { brand, model, yearFrom, yearTo, priceFrom, priceTo } = req.query;

    const filter = {};

    if (brand) filter.brand = brand;
    if (model) filter.model = model;

    if (yearFrom || yearTo) {
      filter.year = {};
      if (yearFrom) filter.year.$gte = parseInt(yearFrom);
      if (yearTo) filter.year.$lte = parseInt(yearTo);
    }

    if (priceFrom || priceTo) {
      filter.price = {};
      if (priceFrom) filter.price.$gte = parseInt(priceFrom);
      if (priceTo) filter.price.$lte = parseInt(priceTo);
    }

    const count = await Listing.countDocuments(filter);
    res.send({ count });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { brand, model, yearFrom, yearTo, priceFrom, priceTo } = req.query;

    const filter = {};

    if (brand) filter.brand = brand;
    if (model) filter.model = model;

    if (yearFrom || yearTo) {
      filter.year = {};
      if (yearFrom) filter.year.$gte = parseInt(yearFrom);
      if (yearTo) filter.year.$lte = parseInt(yearTo);
    }

    if (priceFrom || priceTo) {
      filter.price = {};
      if (priceFrom) filter.price.$gte = parseInt(priceFrom);
      if (priceTo) filter.price.$lte = parseInt(priceTo);
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.send(listings);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send({ message: "Listing not found" });
    }
    res.send(listing);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!listing) {
      return res.status(404).send({ message: "Listing not found" });
    }
    res.send(listing);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).send({ message: "Listing not found" });
    }
    res.send({ message: "Listing deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
