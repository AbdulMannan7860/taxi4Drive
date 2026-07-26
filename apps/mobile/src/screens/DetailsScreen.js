import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { updateBookingStatus } from "../api";
import { colors, fonts } from "../theme";

function Row({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "dispatched", label: "Dispatched" },
  { value: "completed", label: "Completed" }
];

export default function DetailsScreen({ booking, jwt, onBack, onStatusUpdate }) {
  const [driverName, setDriverName] = useState(booking.driverName || "");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  async function handleStatusPress(status) {
    if (status === "dispatched" && !driverName.trim()) {
      setError("Enter the driver's name to dispatch this booking.");
      return;
    }

    setError("");
    setUpdating(true);
    try {
      const { booking: updated } = await updateBookingStatus(
        jwt,
        booking._id,
        status,
        status === "dispatched" ? driverName.trim() : undefined
      );
      onStatusUpdate(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={18} color={colors.gold} />
        <Text style={styles.back}>Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{booking.reference}</Text>
        <Row label="Customer" value={booking.customerName} />
        <Row label="Phone" value={booking.phone} />
        <Row label="Email" value={booking.email} />
        <Row label="Pickup" value={booking.pickup} />
        <Row label="Drop-off" value={booking.dropoff} />
        <Row label="Date" value={booking.date} />
        <Row label="Time" value={booking.time} />
        <Row label="Vehicle" value={booking.vehicle} />
        <Row label="Estimated fare" value={booking.estimatedFare ? `$${booking.estimatedFare}` : ""} />

        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.statusRow}>
          {STATUSES.map((item) => {
            const active = booking.status === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.statusPill, active && styles.statusPillActive]}
                onPress={() => handleStatusPress(item.value)}
                disabled={updating}
              >
                <Text style={[styles.statusPillText, active && styles.statusPillTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Driver name</Text>
        <TextInput
          style={styles.input}
          placeholder="Required to dispatch"
          placeholderTextColor={colors.slate}
          value={driverName}
          onChangeText={setDriverName}
          editable={!updating}
        />

        {updating && <ActivityIndicator color={colors.gold} style={{ marginTop: 12 }} />}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.night, padding: 20, paddingTop: 60 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  back: { fontFamily: fonts.bodySemiBold, color: colors.gold, fontSize: 16 },
  content: { paddingBottom: 40 },
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.white, marginBottom: 20 },
  row: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12 },
  label: { fontFamily: fonts.bodySemiBold, color: colors.slate, fontSize: 12, textTransform: "uppercase", marginBottom: 4 },
  value: { fontFamily: fonts.body, color: colors.white, fontSize: 16 },
  sectionTitle: {
    fontFamily: fonts.bodySemiBold,
    color: colors.slate,
    fontSize: 12,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 10
  },
  statusRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statusPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center"
  },
  statusPillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  statusPillText: { fontFamily: fonts.bodySemiBold, color: colors.steel, fontSize: 13 },
  statusPillTextActive: { color: colors.night },
  input: {
    fontFamily: fonts.body,
    color: colors.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  error: { fontFamily: fonts.body, color: colors.error, fontSize: 13, marginTop: 12 }
});
