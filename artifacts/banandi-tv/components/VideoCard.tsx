import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Video } from "@/data/videos";
import { useColors } from "@/hooks/useColors";
import { useFavorites } from "@/context/FavoritesContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  video: Video;
  style?: object;
  horizontal?: boolean;
}

export default function VideoCard({ video, style, horizontal = false }: Props) {
  const colors = useColors();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(video.id);

  return (
    <Pressable
      style={[styles.card, horizontal ? styles.horizontal : styles.vertical, { backgroundColor: colors.card }, style]}
      onPress={() => router.push({ pathname: "/detail", params: { id: video.id } })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: video.cover }}
          style={horizontal ? styles.horizontalImage : styles.verticalImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        {video.type === "series" && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>SÉRIE</Text>
          </View>
        )}
        <Pressable
          style={styles.favBtn}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(video);
          }}
        >
          <Feather name={fav ? "heart" : "heart"} size={14} color={fav ? colors.primary : "#fff"} />
        </Pressable>
        <View style={styles.ratingBadge}>
          <Feather name="star" size={10} color={colors.gold} />
          <Text style={styles.ratingText}>{video.rating}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>
          {video.date} · {video.category}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: "hidden",
  },
  vertical: {
    width: CARD_WIDTH,
  },
  horizontal: {
    width: 160,
    marginRight: 12,
  },
  imageContainer: {
    position: "relative",
  },
  verticalImage: {
    width: "100%",
    height: 200,
  },
  horizontalImage: {
    width: 160,
    height: 220,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    background: "transparent",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  favBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    color: "#FFD700",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  info: {
    padding: 8,
  },
  title: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 18,
    marginBottom: 4,
  },
  meta: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
