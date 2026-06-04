import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import HeroBanner from "@/components/HeroBanner";
import SectionRow from "@/components/SectionRow";
import CategoryPill from "@/components/CategoryPill";
import { CATEGORIES } from "@/data/videos";
import { useColors } from "@/hooks/useColors";
import { useApi } from "@/context/ApiContext";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(0);
  const { homeVideos, trendingVideos, newVideos, seriesVideos, isLoading, isApiLive, refresh } = useApi();
  const [refreshing, setRefreshing] = useState(false);

  const filtered = activeCategory === 0
    ? homeVideos
    : homeVideos.filter((v) => v.categoryId === activeCategory || v.category.toLowerCase().includes(
        CATEGORIES.find((c) => c.id === activeCategory)?.name.toLowerCase() ?? ""
      ));

  async function onRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={{ color: colors.mutedForeground, marginTop: 12, fontFamily: "Inter_400Regular" }}>
          Chargement des contenus…
        </Text>
      </View>
    );
  }

  const bannerItems = trendingVideos.length > 0 ? trendingVideos : homeVideos.slice(0, 5);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>Banandi TV</Text>
          {isApiLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>En direct</Text>
            </View>
          )}
        </View>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E50914"
            colors={["#E50914"]}
          />
        }
      >
        {/* Hero Banner */}
        {bannerItems.length > 0 && <HeroBanner items={bannerItems} />}

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

        {/* Sections */}
        {activeCategory === 0 ? (
          <>
            {trendingVideos.length > 0 && (
              <SectionRow
                title="Tendances"
                data={trendingVideos}
                onSeeAll={() => setActiveCategory(0)}
              />
            )}
            {newVideos.length > 0 && (
              <SectionRow
                title="Nouveautés"
                data={newVideos}
                onSeeAll={() => setActiveCategory(0)}
              />
            )}
            {seriesVideos.length > 0 && (
              <SectionRow
                title="Séries populaires"
                data={seriesVideos}
                onSeeAll={() => setActiveCategory(2)}
              />
            )}
            {homeVideos.length > 8 && (
              <SectionRow
                title="À découvrir"
                data={homeVideos.slice(8, 18)}
              />
            )}
          </>
        ) : (
          <SectionRow
            title={CATEGORIES.find((c) => c.id === activeCategory)?.name ?? ""}
            data={filtered.length > 0 ? filtered : homeVideos}
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#E50914",
    letterSpacing: -0.5,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(229,9,20,0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(229,9,20,0.3)",
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
  },
  liveText: {
    fontSize: 9,
    color: "#4CAF50",
    fontFamily: "Inter_600SemiBold",
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
