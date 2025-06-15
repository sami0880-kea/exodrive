import { Router } from "express";
import Listing from "../models/Listing.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { generalLimiter, strictLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  strictLimiter,
  protect,
  upload.array("images", 6),
  async (req, res) => {
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
        user: req.user._id,
        seller: {
          name: req.user.name,
          email: req.user.email,
          phone: listingData.seller?.phone || "",
          location: listingData.seller?.location || "",
        },
      });

      await listing.save();
      await listing.populate("user", "name email");
      res.status(201).send(listing);
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(400).send({ message: error.message });
    }
  }
);

router.get("/count", generalLimiter, async (req, res) => {
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

router.get("/user/listings", protect, generalLimiter, async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [listings, total] = await Promise.all([
      Listing.find({ user: req.user._id })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Listing.countDocuments({ user: req.user._id }),
    ]);

    res.send({
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/", generalLimiter, async (req, res) => {
  try {
    const {
      brand,
      model,
      yearFrom,
      yearTo,
      priceFrom,
      priceTo,
      page = 1,
      limit = 9,
      sort = "-createdAt",
    } = req.query;

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

    let sortObj = {};
    if (sort === "price-asc") sortObj = { price: 1 };
    else if (sort === "price-desc") sortObj = { price: -1 };
    else if (sort === "date-asc") sortObj = { createdAt: 1 };
    else if (sort === "date-desc") sortObj = { createdAt: -1 };
    else sortObj = { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("user", "name email")
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit)),
      Listing.countDocuments(filter),
    ]);

    res.send({
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/:id", generalLimiter, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!listing) {
      return res.status(404).send({ message: "Listing not found" });
    }
    res.send(listing);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).send({ message: "Listing not found" });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ message: "Not authorized to edit this listing" });
    }

    const updatedData = {
      ...req.body,
      seller: {
        name: req.body.seller?.name || listing.seller.name,
        email: req.body.seller?.email || listing.seller.email,
        phone: req.body.seller?.phone || listing.seller.phone,
        location: req.body.seller?.location || listing.seller.location,
      },
      updatedAt: Date.now(),
    };

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).populate("user", "name email");

    res.send(updatedListing);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).send({ message: "Listing not found" });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ message: "Not authorized to delete this listing" });
    }

    await listing.deleteOne();
    res.send({ message: "Listing deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
