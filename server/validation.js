const { z } = require("zod");

const bookingSchema = z.object({
  tripType: z.enum(["one-way", "return"]),
  serviceType: z.string().min(2).max(120),
  pickup: z.string().min(2).max(240),
  dropoff: z.string().min(2).max(240),
  date: z.string().min(4).max(30),
  time: z.string().min(3).max(20),
  passengers: z.coerce.number().int().min(1).max(45),
  luggage: z.coerce.number().int().min(0).max(60),
  vehicle: z.string().min(2).max(120),
  meetGreet: z.boolean().default(false),
  childSeat: z.boolean().default(false),
  flightTracking: z.boolean().default(true),
  customerName: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(6).max(40),
  flightNumber: z.string().max(40).optional().default(""),
  estimatedFare: z.coerce.number().min(0).max(10000),
  website: z.string().max(0).optional().default("")
});

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"])
});

module.exports = {
  bookingSchema,
  statusSchema
};
