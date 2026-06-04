import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import VideoCard from "@/components/VideoCard";
import { VIDEOS, searchVideos } from "@/data/videos";
import { useColors } from "@/hooks/useColors";

const HOT_SEARCHES = ["Action", "Séries", "Animation", "Horreur", "Netflix", "Marvel"];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = query.trim().length > 0 ? searchVideos(query) : [];
  const trending = VIDEOS.slice(0, 6);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Films, séries, acteurs..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={[styles.cancelText, { color: colors.primary }]}>Annuler</Text>
        </Pressable>
      </View>

      {query.trim().length === 0 ? (
        <View style={styles.suggestions}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recherches populaires</Text>
          <View style={styles.hotTags}>
            {HOT_SEARCHES.map((tag) => (
              <Pressable
                key={tag}
                style={[styles.hotTag, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setQuery(tag)}
              >
                <Feather name="trending-up" size={14} color={colors.primary} />
                <Text style={[styles.hotTagText, { color: colors.foreground }]}>{tag}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 24 }]}>
            Populaires en ce moment
          </Text>
          <FlatList
            data={trending}
            numColumns={2}
            keyExtractor={(v) => String(v.id)}
            contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : 100 }}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => <VideoCard video={item} style={{ marginBottom: 16 }} />}
            scrollEnabled={false}
          />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="search" size={48} color={colors.muted} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Aucun résultat</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Essayez un autre terme de recherche
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={(v) => String(v.id)}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
              {results.length} résultat{results.length > 1 ? "s" : ""}
            </Text>
          }
          renderItem={({ item }) => <VideoCard video={item} style={{ marginBottom: 16 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  cancelBtn: {
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  suggestions: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  hotTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  hotTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  hotTagText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "web" ? 34 : 100,
  },
  row: {
    justifyContent: "space-between",
  },
  resultCount: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    paddingBottom: 12,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
