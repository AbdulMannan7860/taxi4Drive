import { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../theme";

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function handleSubmit() {
    if (!password) return;
    setStatus({ state: "loading", message: "" });
    try {
      await onLogin(password);
    } catch (error) {
      setStatus({ state: "error", message: error.message });
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/brand/logo-white.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.subtitle}>Sign in to receive booking alerts</Text>
      <TextInput
        style={styles.input}
        placeholder="CRM password"
        placeholderTextColor={colors.slate}
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={status.state === "loading"}>
        {status.state === "loading" ? (
          <ActivityIndicator color={colors.navy} />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </TouchableOpacity>
      {status.state === "error" && <Text style={styles.error}>{status.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.night },
  logo: { width: 220, height: 80, marginBottom: 12 },
  subtitle: { fontFamily: fonts.body, fontSize: 15, color: colors.steel, marginBottom: 24 },
  input: {
    fontFamily: fonts.body,
    backgroundColor: colors.navy,
    color: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  button: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonText: { fontFamily: fonts.bodyBold, color: colors.navy, fontSize: 16 },
  error: { fontFamily: fonts.body, color: colors.error, marginTop: 12 }
});
