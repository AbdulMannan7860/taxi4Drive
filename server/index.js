require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { createToken, requireAdmin } = require("./auth");
const { ObjectId, bookingsCollection, connectDb } = require("./db");
const { sendBookingEmails } = require("./mailer");
const { bookingSchema, statusSchema } = require("./validation");

const app = express();
const port = Number(process.env.PORT || 6000);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "taxi4drive-api" });
});

app.post("/api/auth/login", (req, res) => {
  const password = req.body?.password;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid CRM password." });
  }

  return res.json({ token: createToken() });
});

app.post("/api/bookings", async (req, res, next) => {
  try {
    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message || "Invalid booking details." });
    }

    const booking = {
      ...parsed.data,
      reference: `T2A-${Date.now().toString(36).toUpperCase()}`,
      status: "pending",
      source: req.headers["x-client-source"] || "website",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    delete booking.website;

    const result = await bookingsCollection().insertOne(booking);
    const savedBooking = { ...booking, _id: result.insertedId };

    sendBookingEmails(savedBooking).catch((error) => {
      console.error("Booking email failed:", error.message);
    });

    return res.status(201).json({ booking: savedBooking });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/bookings", requireAdmin, async (req, res, next) => {
  try {
    const bookings = await bookingsCollection()
      .find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    return res.json({ bookings });
  } catch (error) {
    return next(error);
  }
});

app.patch("/api/bookings/:id/status", requireAdmin, async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking id." });
    }

    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid booking status." });
    }

    const result = await bookingsCollection().findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: parsed.data.status, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "Booking not found." });
    }

    return res.json({ booking: result });
  } catch (error) {
    return next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Taxi4Drive API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("API failed to start:", error);
    process.exit(1);
  });
