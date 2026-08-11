import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { updateBookingFare, updateBookingStatus } from "../api";
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

const SESSION_ERROR_CODES = ["SESSION_EXPIRED", "AUTH_REQUIRED"];

export default function DetailsScreen({ booking, jwt, onBack, onStatusUpdate, onSessionExpired }) {
  const [driverName, setDriverName] = useState(booking.driverName || "");
  const [confirmedFare, setConfirmedFare] = useState(
    booking.confirmedFare != null ? String(booking.confirmedFare) : ""
  );
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const isCompleted = booking.status === "completed";

  function handleErrorOrSessionExpiry(err) {
    if (SESSION_ERROR_CODES.includes(err.code)) {
      onSessionExpired();
      return true;
    }
    setError(err.message);
    return false;
  }

  async function handleSaveFare() {
    const amount = Number(confirmedFare);
    if (!confirmedFare.trim() || Number.isNaN(amount) || amount < 0) {
      setError("Enter a valid confirmed price.");
      return;
    }

    setError("");
    setUpdating(true);
    try {
      const { booking: updated } = await updateBookingFare(jwt, booking._id, amount);
      onStatusUpdate(updated);
    } catch (err) {
      handleErrorOrSessionExpiry(err);
    } finally {
      setUpdating(false);
    }
  }

  async function handleStatusPress(status) {
    if (isCompleted) return;
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
      handleErrorOrSessionExpiry(err);
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

        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.statusRow}>
          {STATUSES.map((item) => {
            const active = booking.status === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.statusPill, active && styles.statusPillActive]}
                onPress={() => handleStatusPress(item.value)}
                disabled={updating || isCompleted}
              >
                <Text style={[styles.statusPillText, active && styles.statusPillTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isCompleted && <Text style={styles.locked}>This booking is completed and can no longer be updated.</Text>}

        <Text style={styles.label}>Driver name</Text>
        <TextInput
          style={styles.input}
          placeholder="Required to dispatch"
          placeholderTextColor={colors.slate}
          value={driverName}
          onChangeText={setDriverName}
          editable={!updating && !isCompleted}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Confirmed price with customer</Text>
        <View style={styles.fareRow}>
          <TextInput
            style={[styles.input, styles.fareInput]}
            placeholder="e.g. 85"
            placeholderTextColor={colors.slate}
            value={confirmedFare}
            onChangeText={setConfirmedFare}
            keyboardType="decimal-pad"
            editable={!updating && !isCompleted}
          />
          <TouchableOpacity
            style={[styles.saveFareButton, (updating || isCompleted) && styles.saveFareButtonDisabled]}
            onPress={handleSaveFare}
            disabled={updating || isCompleted}
          >
            <Text style={styles.saveFareButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

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
  locked: { fontFamily: fonts.body, color: colors.slate, fontSize: 13, marginTop: -10, marginBottom: 16 },
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
  fareRow: { flexDirection: "row", gap: 10, alignItems: "stretch" },
  fareInput: { flex: 1 },
  saveFareButton: {
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  saveFareButtonDisabled: { opacity: 0.5 },
  saveFareButtonText: { fontFamily: fonts.bodyBold, color: colors.night, fontSize: 15 },
  error: { fontFamily: fonts.body, color: colors.error, fontSize: 13, marginTop: 12 }
});
