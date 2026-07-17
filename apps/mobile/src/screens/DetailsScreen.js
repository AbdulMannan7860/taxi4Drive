import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

export default function DetailsScreen({ booking, onBack }) {
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
        <Row label="Status" value={booking.status} />
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
  value: { fontFamily: fonts.body, color: colors.white, fontSize: 16 }
});
