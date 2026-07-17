import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../theme";

export default function NotificationsScreen({ notifications, pushWarning, onSelect, onSignOut }) {
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

      {notifications.length === 0 ? (
        <Text style={styles.empty}>No bookings yet. New requests will show up here.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.booking.reference}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
              <View style={styles.cardIcon}>
                <Ionicons name="car" size={18} color={colors.gold} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.reference}>{item.booking.reference}</Text>
                <Text style={styles.customer}>{item.booking.customerName}</Text>
                <Text style={styles.route}>
                  {item.booking.pickup} → {item.booking.dropoff}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.slate} />
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
  empty: { fontFamily: fonts.body, color: colors.slate, fontSize: 15, marginTop: 40, textAlign: "center" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.navy,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardIcon: {
    height: 36,
    width: 36,
    borderRadius: 10,
    backgroundColor: colors.night,
    alignItems: "center",
    justifyContent: "center"
  },
  cardBody: { flex: 1 },
  reference: { fontFamily: fonts.bodyBold, color: colors.gold, fontSize: 14, marginBottom: 4 },
  customer: { fontFamily: fonts.bodySemiBold, color: colors.white, fontSize: 16, marginBottom: 2 },
  route: { fontFamily: fonts.body, color: colors.steel, fontSize: 14 }
});
