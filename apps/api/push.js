const { Expo } = require("expo-server-sdk");
const { log } = require("./logger");
const { pushTokensCollection } = require("./db");

const expo = new Expo();

async function registerPushToken(token, platform) {
  await pushTokensCollection().updateOne(
    { token },
    { $set: { token, platform, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
}

function bookingPushMessage(booking, pushToken) {
  return {
    to: pushToken,
    sound: "default",
    title: `New booking - ${booking.reference}`,
    body: `${booking.customerName} - ${booking.pickup} to ${booking.dropoff}`,
    data: {
      type: "booking.created",
      booking: {
        _id: String(booking._id),
        reference: booking.reference,
        customerName: booking.customerName,
        phone: booking.phone,
        email: booking.email,
        pickup: booking.pickup,
        dropoff: booking.dropoff,
        date: booking.date,
        time: booking.time,
        vehicle: booking.vehicle,
        estimatedFare: booking.estimatedFare,
        status: booking.status
      }
    }
  };
}

async function sendBookingPush(booking) {
  const tokens = await pushTokensCollection().find({}).toArray();
  const messages = tokens
    .map((entry) => entry.token)
    .filter((token) => {
      if (Expo.isExpoPushToken(token)) return true;
      log("warn", "skipping invalid expo push token", { token });
      return false;
    })
    .map((token) => bookingPushMessage(booking, token));

  if (!messages.length) {
    return { sent: 0 };
  }

  const chunks = expo.chunkPushNotifications(messages);
  let sent = 0;

  for (const chunk of chunks) {
    const tickets = await expo.sendPushNotificationsAsync(chunk);
    sent += tickets.length;
    for (const ticket of tickets) {
      if (ticket.status === "error") {
        log("warn", "expo push ticket error", { error: ticket.message, details: ticket.details });
      }
    }
  }

  return { sent };
}

module.exports = {
  registerPushToken,
  sendBookingPush
};
