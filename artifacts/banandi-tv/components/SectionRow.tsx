import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Video } from "@/data/videos";
import { useColors } from "@/hooks/useColors";
import VideoCard from "./VideoCard";

interface Props {
  title: string;
  data: Video[];
  onSeeAll?: () => void;
}

export default function SectionRow({ title, data, onSeeAll }: Props) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        {onSeeAll && (
          <Pressable style={styles.seeAll} onPress={onSeeAll}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Tout voir</Text>
            <Feather name="chevron-right" size={14} color={colors.primary} />
          </Pressable>
        )}
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(v) => String(v.id)}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <VideoCard video={item} horizontal />}
        scrollEnabled={data.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
