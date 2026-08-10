import { useFonts as useMontserrat, Montserrat_700Bold, Montserrat_800ExtraBold } from "@expo-google-fonts/montserrat";
import { useFonts as usePoppins, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";
import { useEffect, useRef, useState } from "react";
import { Platform, SafeAreaView, StatusBar } from "react-native";
import { getBookings, login, registerPushToken } from "./src/api";
import { registerForPushNotificationsAsync } from "./src/pushNotifications";
import DetailsScreen from "./src/screens/DetailsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";

const JWT_KEY = "taxi2airport_admin_jwt";
const SESSION_ERROR_CODES = ["SESSION_EXPIRED", "AUTH_REQUIRED"];

export default function App() {
  const [jwt, setJwt] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [montserratLoaded] = useMontserrat({ Montserrat_700Bold, Montserrat_800ExtraBold });
  const [poppinsLoaded] = usePoppins({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pushWarning, setPushWarning] = useState("");
  const receivedListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    SecureStore.getItemAsync(JWT_KEY).then((stored) => {
      setJwt(stored);
      setCheckingSession(false);
    });

    if (__DEV__ || !Updates.isEnabled) return;
    Updates.checkForUpdateAsync()
      .then((update) => (update.isAvailable ? Updates.fetchUpdateAsync() : null))
      .then((result) => {
        if (result?.isNew) return Updates.reloadAsync();
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!jwt) return;

    getBookings(jwt)
      .then(({ bookings }) => {
        setNotifications(bookings.map((booking) => ({ booking, receivedAt: new Date(booking.createdAt) })));
      })
      .catch((error) => {
        if (SESSION_ERROR_CODES.includes(error.code)) return handleSignOut();
        setPushWarning(error.message);
      });

    registerForPushNotificationsAsync()
      .then((token) => registerPushToken(jwt, token, Platform.OS))
      .catch((error) => setPushWarning(error.message));

    receivedListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const booking = notification.request.content.data?.booking;
      if (!booking) return;
      setNotifications((current) => {
        if (current.some((item) => item.booking.reference === booking.reference)) return current;
        return [{ booking, receivedAt: new Date() }, ...current];
      });
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const booking = response.notification.request.content.data?.booking;
      if (booking) setSelected({ booking });
    });

    return () => {
      receivedListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [jwt]);

  async function handleLogin(password) {
    const data = await login(password);
    await SecureStore.setItemAsync(JWT_KEY, data.token);
    setJwt(data.token);
  }

  function handleStatusUpdate(updatedBooking) {
    setNotifications((current) =>
      current.map((item) =>
        item.booking.reference === updatedBooking.reference ? { ...item, booking: updatedBooking } : item
      )
    );
    setSelected((current) => (current ? { ...current, booking: updatedBooking } : current));
  }

  async function handleSignOut() {
    await SecureStore.deleteItemAsync(JWT_KEY);
    setJwt(null);
    setNotifications([]);
    setSelected(null);
    setPushWarning("");
  }

  if (checkingSession || !montserratLoaded || !poppinsLoaded) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: "#071426" }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#071426" }}>
      <StatusBar barStyle="light-content" />
      {!jwt ? (
        <LoginScreen onLogin={handleLogin} />
      ) : selected ? (
        <DetailsScreen
          booking={selected.booking}
          jwt={jwt}
          onBack={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
          onSessionExpired={handleSignOut}
        />
      ) : (
        <NotificationsScreen
          notifications={notifications}
          pushWarning={pushWarning}
          onSelect={setSelected}
          onSignOut={handleSignOut}
        />
      )}
    </SafeAreaView>
  );
}
