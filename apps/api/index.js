require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { createToken, requireAdmin } = require("./auth");
const {
  ObjectId,
  auditLogsCollection,
  bookingsCollection,
  connectDb,
  notificationsCollection,
  vehiclesCollection
} = require("./db");
const { log, requestLogger } = require("./logger");
const { sendBookingEmails } = require("./mailer");
const { registerPushToken, sendBookingPush } = require("./push");
const { sendError, sendSuccess } = require("./responses");
const { bookingSchema, pushTokenSchema, statusSchema } = require("./validation");

const app = express();
const port = Number(process.env.PORT || 6000);
const startedAt = new Date();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);
app.use(
  "/api/",
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    limit: Number(process.env.RATE_LIMIT_MAX || 120),
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please wait a moment and try again."
      }
    }
  })
);

const bookingLimiter = rateLimit({
  windowMs: Number(process.env.BOOKING_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000),
  limit: Number(process.env.BOOKING_RATE_LIMIT_MAX || 10),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "BOOKING_RATE_LIMITED",
      message: "Too many booking attempts. Please call us if this is urgent."
    }
  }
});

async function writeAuditLog(action, entityId, actor, changes = {}) {
  try {
    await auditLogsCollection().insertOne({
      action,
      entityType: "booking",
      entityId,
      actor,
      changes,
      createdAt: new Date()
    });
  } catch (error) {
    log("warn", "audit log write failed", { action, entityId, error: error.message });
  }
}

app.get("/api/health", (req, res) => {
  return sendSuccess(res, {
    service: "taxi4drive-api",
    status: "ok",
    startedAt,
    uptimeSeconds: Math.round(process.uptime())
  });
});

app.post("/api/auth/login", (req, res) => {
  const password = req.body?.password;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid CRM password.");
  }

  return sendSuccess(res, { token: createToken() }, "Authenticated.");
});

app.post("/api/bookings", bookingLimiter, async (req, res, next) => {
  try {
    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        400,
        "INVALID_BOOKING",
        parsed.error.issues[0]?.message || "Invalid booking details."
      );
    }

    const booking = {
      ...parsed.data,
      reference: `T4D-${Date.now().toString(36).toUpperCase()}`,
      status: "pending",
      source: req.headers["x-client-source"] || "website",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    delete booking.website;

    const result = await bookingsCollection().insertOne(booking);
    const savedBooking = { ...booking, _id: result.insertedId };

    await notificationsCollection().insertOne({
      type: "booking.created",
      status: "pending",
      bookingId: result.insertedId,
      reference: booking.reference,
      channel: "email",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await writeAuditLog("booking.created", result.insertedId, "website", { status: "pending" });

    sendBookingEmails(savedBooking).catch((error) => {
      log("error", "booking email failed", { reference: savedBooking.reference, error: error.message });
    });

    sendBookingPush(savedBooking).catch((error) => {
      log("error", "booking push failed", { reference: savedBooking.reference, error: error.message });
    });

    return sendSuccess(res, { booking: savedBooking }, "Booking request received.", 201);
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

    return sendSuccess(res, { bookings });
  } catch (error) {
    return next(error);
  }
});

app.patch("/api/bookings/:id/status", requireAdmin, async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return sendError(res, 400, "INVALID_BOOKING_ID", "Invalid booking id.");
    }

    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 400, "INVALID_STATUS", "Invalid booking status.");
    }

    const existing = await bookingsCollection().findOne({ _id: new ObjectId(req.params.id) });
    if (!existing) {
      return sendError(res, 404, "BOOKING_NOT_FOUND", "Booking not found.");
    }

    const result = await bookingsCollection().findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: parsed.data.status, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    await writeAuditLog("booking.status.updated", result._id, req.admin?.role || "admin", {
      from: existing.status,
      to: parsed.data.status
    });

    return sendSuccess(res, { booking: result }, "Booking status updated.");
  } catch (error) {
    return next(error);
  }
});

app.post("/api/admin/push-tokens", requireAdmin, async (req, res, next) => {
  try {
    const parsed = pushTokenSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        400,
        "INVALID_PUSH_TOKEN",
        parsed.error.issues[0]?.message || "Invalid push token."
      );
    }

    await registerPushToken(parsed.data.token, parsed.data.platform);

    return sendSuccess(res, {}, "Push token registered.", 201);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/vehicles", async (req, res, next) => {
  try {
    const vehicles = await vehiclesCollection().find({ deletedAt: { $exists: false } }).sort({ name: 1 }).toArray();
    return sendSuccess(res, { vehicles });
  } catch (error) {
    return next(error);
  }
});

app.use((error, req, res, next) => {
  log("error", "unhandled api error", {
    method: req.method,
    path: req.originalUrl,
    error: error.message
  });
  return sendError(res, 500, "INTERNAL_ERROR", "Something went wrong. Please try again.");
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      log("info", "api started", { url: `http://localhost:${port}` });
    });
  })
  .catch((error) => {
    log("error", "api failed to start", { error: error.message });
    process.exit(1);
  });
