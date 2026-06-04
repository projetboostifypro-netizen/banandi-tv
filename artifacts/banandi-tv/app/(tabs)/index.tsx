import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import HeroBanner from "@/components/HeroBanner";
import SectionRow from "@/components/SectionRow";
import CategoryPill from "@/components/CategoryPill";
import { TRENDING, MOVIES, SERIES, VIDEOS, getVideosByCategory, CATEGORIES } from "@/data/videos";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(0);

  const filtered = getVideosByCategory(activeCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top }]}>
        <Text style={styles.logo}>Banandi TV</Text>
        <View style={styles.headerRight}>
          <Pressable onPress={() => router.push("/search")} style={styles.iconBtn}>
            <Feather name="search" size={22} color="#fff" />
          </Pressable>
          <Pressable onPress={() => router.push("/(tabs)/profile")} style={styles.iconBtn}>
            <Feather name="user" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : 90 }}
      >
        {/* Hero Banner */}
        <HeroBanner items={TRENDING} />

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pills}
          style={{ marginVertical: 16 }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat.id}
              label={cat.name}
              active={activeCategory === cat.id}
              onPress={() => setActiveCategory(cat.id)}
            />
          ))}
        </ScrollView>

        {/* Dynamic section based on category */}
        {activeCategory === 0 ? (
          <>
            <SectionRow
              title="Tendances"
              data={TRENDING}
              onSeeAll={() => setActiveCategory(0)}
            />
            <SectionRow
              title="Films populaires"
              data={MOVIES}
              onSeeAll={() => setActiveCategory(1)}
            />
            <SectionRow
              title="Séries populaires"
              data={SERIES}
              onSeeAll={() => setActiveCategory(2)}
            />
          </>
        ) : (
          <SectionRow
            title={CATEGORIES.find((c) => c.id === activeCategory)?.name ?? ""}
            data={filtered}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "transparent",
  },
  logo: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#E50914",
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 19,
  },
  scroll: {
    flex: 1,
  },
  pills: {
    paddingHorizontal: 16,
  },
});
