import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../theme";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "dispatched", label: "Dispatched" },
  { value: "completed", label: "Completed" }
];

const STATUS_COLORS = {
  pending: colors.steel,
  dispatched: colors.gold,
  completed: colors.success
};

export default function NotificationsScreen({ notifications, pushWarning, onSelect, onSignOut }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((item) => item.booking.status === filter);
  }, [notifications, filter]);

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <Image source={require("../../assets/brand/logo-white.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brandName}>Admin</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Booking alerts</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
          <Ionicons name="log-out-outline" size={16} color={colors.steel} />
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {pushWarning && <Text style={styles.warning}>{pushWarning}</Text>}

      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const active = filter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              style={[styles.filterPill, active && styles.filterPillActive]}
              onPress={() => setFilter(item.value)}
            >
              <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <Text style={styles.empty}>
          {notifications.length === 0 ? "No bookings yet. New requests will show up here." : "No bookings in this status."}
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.booking.reference}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
              <View style={styles.cardTopRow}>
                <View style={styles.cardIcon}>
                  <Ionicons name="car" size={18} color={colors.gold} />
                </View>
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.booking.status] || colors.steel }]} />
                  <Text style={styles.statusLabel}>{item.booking.status || "pending"}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.reference}>{item.booking.reference}</Text>
                <Text style={styles.customer}>{item.booking.customerName}</Text>
                <Text style={styles.route}>
                  {item.booking.pickup} → {item.booking.dropoff}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.night, padding: 20, paddingTop: 60 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 24 },
  logo: { width: 110, height: 32 },
  brandName: { fontFamily: fonts.bodySemiBold, color: colors.slate, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.white },
  signOutButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  signOut: { fontFamily: fonts.body, color: colors.steel, fontSize: 14 },
  warning: { fontFamily: fonts.body, color: colors.gold, marginBottom: 16, fontSize: 13 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center"
  },
  filterPillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  filterPillText: { fontFamily: fonts.bodySemiBold, color: colors.steel, fontSize: 12 },
  filterPillTextActive: { color: colors.night },
  empty: { fontFamily: fonts.body, color: colors.slate, fontSize: 15, marginTop: 40, textAlign: "center" },
  card: {
    backgroundColor: colors.navy,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  },
  cardIcon: {
    height: 36,
    width: 36,
    borderRadius: 10,
    backgroundColor: colors.night,
    alignItems: "center",
    justifyContent: "center"
  },
  cardBody: {},
  reference: { fontFamily: fonts.bodyBold, color: colors.gold, fontSize: 14, marginBottom: 4 },
  customer: { fontFamily: fonts.bodySemiBold, color: colors.white, fontSize: 16, marginBottom: 2 },
  route: { fontFamily: fonts.body, color: colors.steel, fontSize: 14 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: colors.night,
    borderWidth: 1,
    borderColor: colors.border
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontFamily: fonts.bodySemiBold, color: colors.steel, fontSize: 11, textTransform: "capitalize" }
});
