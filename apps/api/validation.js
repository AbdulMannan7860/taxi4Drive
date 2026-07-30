const { z } = require("zod");

const bookingSchema = z.object({
  tripType: z.enum(["One Way", "Return Trip", "one-way", "return"]).transform((value) => {
    if (value === "one-way") return "One Way";
    if (value === "return") return "Return Trip";
    return value;
  }),
  serviceType: z.string().min(2).max(120),
  pickup: z.string().min(2).max(240),
  pickupSuburb: z.string().max(120).optional().default(""),
  dropoff: z.string().min(2).max(240),
  dropoffSuburb: z.string().max(120).optional().default(""),
  date: z.string().min(4).max(30),
  time: z.string().min(3).max(20),
  passengers: z.coerce.number().int().min(1).max(55),
  luggage: z.coerce.number().int().min(0).max(22),
  vehicle: z.string().min(2).max(120),
  meetGreet: z.boolean().default(false),
  childSeat: z.boolean().default(false),
  babySeatType: z.string().max(80).optional().default(""),
  business: z.boolean().default(false),
  flightTracking: z.boolean().default(true),
  customerName: z.string().min(2).max(120).regex(/\p{L}/u, "Enter a valid full name."),
  email: z.string().email().max(160),
  phone: z
    .string()
    .min(6)
    .max(40)
    .regex(/^[+]?[0-9\s()-]{6,20}$/, "Enter a valid phone number.")
    .refine((value) => (value.match(/\d/g) || []).length >= 8, "Enter a valid phone number."),
  flightNumber: z.string().max(40).optional().default(""),
  instructions: z.string().max(500).optional().default(""),
  estimatedFare: z.coerce.number().min(0).max(10000),
  website: z.string().max(0).optional().default("")
});

const statusSchema = z
  .object({
    status: z.enum(["pending", "dispatched", "completed"]),
    driverName: z.string().min(2).max(120).optional()
  })
  .refine((data) => data.status !== "dispatched" || !!data.driverName, {
    message: "Driver name is required when dispatching a booking.",
    path: ["driverName"]
  });

const pushTokenSchema = z.object({
  token: z.string().min(10).max(200),
  platform: z.enum(["ios", "android"]).optional().default("android")
});

module.exports = {
  bookingSchema,
  statusSchema,
  pushTokenSchema
};
