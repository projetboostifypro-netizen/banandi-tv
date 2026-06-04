import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, login, register, logout } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!nickname) { setError("Pseudo requis"); setLoading(false); return; }
        await register(nickname, email, password);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setError("Une erreur est survenue");
    }
    setLoading(false);
  }

  async function handleLogout() {
    Alert.alert("Déconnexion", "Voulez-vous vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: async () => {
          await logout();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.authHeader, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 20 }]}>
          <Text style={styles.logoText}>Banandi TV</Text>
          <Text style={[styles.authSubtitle, { color: colors.mutedForeground }]}>
            Connectez-vous pour profiter de tous les contenus
          </Text>
        </View>

        <View style={[styles.authForm, { backgroundColor: colors.card }]}>
          {/* Tab switcher */}
          <View style={[styles.tabRow, { backgroundColor: colors.muted }]}>
            {(["login", "register"] as const).map((m) => (
              <Pressable
                key={m}
                style={[styles.tab, mode === m && { backgroundColor: colors.primary }]}
                onPress={() => { setMode(m); setError(""); }}
              >
                <Text style={[styles.tabText, { color: mode === m ? "#fff" : colors.mutedForeground }]}>
                  {m === "login" ? "Connexion" : "Inscription"}
                </Text>
              </Pressable>
            ))}
          </View>

          {mode === "register" && (
            <View style={styles.inputGroup}>
              <Feather name="user" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Pseudo"
                placeholderTextColor={colors.mutedForeground}
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="none"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Feather name="mail" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Email"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Feather name="lock" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Mot de passe"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer un compte"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const menuItems = [
    { icon: "heart" as const, label: "Ma liste", onPress: () => router.push("/(tabs)/favorites") },
    { icon: "clock" as const, label: "Historique", onPress: () => {} },
    { icon: "download" as const, label: "Téléchargements", onPress: () => {} },
    { icon: "settings" as const, label: "Paramètres", onPress: () => {} },
    { icon: "help-circle" as const, label: "Aide & Support", onPress: () => {} },
    { icon: "info" as const, label: "À propos", onPress: () => {} },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : 100 }}
    >
      <View style={[styles.profileHeader, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 20 }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {user.nickname.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.nickname, { color: colors.foreground }]}>{user.nickname}</Text>
        <Text style={[styles.emailText, { color: colors.mutedForeground }]}>{user.email}</Text>
        {user.is_vip && (
          <View style={[styles.vipBadge, { backgroundColor: colors.gold }]}>
            <Feather name="star" size={12} color="#000" />
            <Text style={styles.vipText}>VIP</Text>
          </View>
        )}
      </View>

      <View style={[styles.statsRow, { borderColor: colors.border }]}>
        {[
          { label: "Films vus", value: "24" },
          { label: "Séries", value: "8" },
          { label: "Favoris", value: "12" },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
        {menuItems.map((item, i) => (
          <Pressable
            key={item.label}
            style={[
              styles.menuItem,
              i < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={item.onPress}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.muted }]}>
              <Feather name={item.icon} size={18} color={colors.foreground} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.logoutBtn, { borderColor: colors.destructive }]}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={18} color={colors.destructive} />
        <Text style={[styles.logoutText, { color: colors.destructive }]}>Se déconnecter</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  authHeader: {
    alignItems: "center",
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  logoText: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    color: "#E50914",
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  authForm: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    paddingHorizontal: 14,
    gap: 10,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  submitBtn: {
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  profileHeader: {
    alignItems: "center",
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  nickname: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  vipBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  vipText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#000",
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  menuCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
