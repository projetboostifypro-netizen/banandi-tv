import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CategoryPill from "@/components/CategoryPill";
import VideoCard from "@/components/VideoCard";
import { CATEGORIES, getVideosByCategory } from "@/data/videos";
import { useColors } from "@/hooks/useColors";

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState(0);

  const videos = getVideosByCategory(activeCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Explorer</Text>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item }) => (
            <CategoryPill
              label={item.name}
              active={activeCategory === item.id}
              onPress={() => setActiveCategory(item.id)}
            />
          )}
        />
      </View>

      <FlatList
        data={videos}
        numColumns={2}
        keyExtractor={(v) => String(v.id)}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <VideoCard video={item} style={{ marginBottom: 16 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Aucun contenu</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "web" ? 34 : 100,
  },
  row: {
    justifyContent: "space-between",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
});
