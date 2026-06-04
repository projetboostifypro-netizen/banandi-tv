import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ResizeMode, Video as ExpoVideo } from "expo-av";
import React, { useRef, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import VideoCard from "@/components/VideoCard";
import { VIDEOS, Video } from "@/data/videos";
import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";

export default function DetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const video = VIDEOS.find((v) => v.id === Number(id));
  const videoRef = useRef<ExpoVideo>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);

  if (!video) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Contenu introuvable</Text>
      </View>
    );
  }

  const fav = isFavorite(video.id);
  const related = VIDEOS.filter((v) => v.categoryId === video.categoryId && v.id !== video.id).slice(0, 4);
  const playUrl =
    video.type === "series" && video.episodes
      ? video.episodes[selectedEpisode]?.vod_url ?? video.play_url
      : video.play_url;

  function handlePlay() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowPlayer(true);
    setIsPlaying(true);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back button */}
      <Pressable
        style={[styles.backBtn, { top: Platform.OS === "web" ? 67 + 10 : insets.top + 10 }]}
        onPress={() => router.back()}
      >
        <Feather name="arrow-left" size={22} color="#fff" />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : 40 }}
      >
        {/* Hero / Player */}
        {showPlayer ? (
          <View style={styles.playerContainer}>
            <ExpoVideo
              ref={videoRef}
              source={{ uri: playUrl }}
              style={styles.player}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={isPlaying}
              useNativeControls
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded) setIsPlaying(status.isPlaying);
              }}
            />
          </View>
        ) : (
          <View style={styles.heroContainer}>
            <Image source={{ uri: video.cover }} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroOverlay} />
            <Pressable style={styles.playOverlayBtn} onPress={handlePlay}>
              <View style={[styles.playCircle, { backgroundColor: colors.primary }]}>
                <Feather name="play" size={32} color="#fff" />
              </View>
            </Pressable>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.title, { color: colors.foreground }]}>{video.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingChip}>
              <Feather name="star" size={14} color="#FFD700" />
              <Text style={[styles.ratingText, { color: "#FFD700" }]}>{video.rating}</Text>
            </View>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{video.date}</Text>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{video.duration}</Text>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{video.country}</Text>
          </View>

          <View style={styles.tags}>
            {video.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.muted }]}>
                <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.playBtn, { backgroundColor: colors.primary }]}
              onPress={handlePlay}
            >
              <Feather name="play" size={20} color="#fff" />
              <Text style={styles.playText}>Regarder</Text>
            </Pressable>
            <Pressable
              style={[styles.favBtn, { backgroundColor: fav ? colors.primary : colors.card, borderColor: colors.border }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleFavorite(video);
              }}
            >
              <Feather name={fav ? "check" : "plus"} size={20} color={fav ? "#fff" : colors.foreground} />
              <Text style={[styles.favText, { color: fav ? "#fff" : colors.foreground }]}>
                {fav ? "Ajouté" : "Ma liste"}
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {video.description}
          </Text>

          <View style={styles.statRow}>
            <Feather name="eye" size={14} color={colors.mutedForeground} />
            <Text style={[styles.statText, { color: colors.mutedForeground }]}>{video.views} vues</Text>
          </View>
        </View>

        {/* Episodes */}
        {video.type === "series" && video.episodes && (
          <View style={styles.episodesSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Épisodes</Text>
            {video.episodes.map((ep, idx) => (
              <Pressable
                key={ep.id}
                style={[
                  styles.episodeItem,
                  {
                    backgroundColor: selectedEpisode === idx ? colors.primary : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  setSelectedEpisode(idx);
                  setShowPlayer(true);
                  setIsPlaying(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View style={[styles.episodeNum, { backgroundColor: selectedEpisode === idx ? "rgba(255,255,255,0.2)" : colors.muted }]}>
                  <Text style={[styles.episodeNumText, { color: selectedEpisode === idx ? "#fff" : colors.foreground }]}>
                    {ep.episodeNum}
                  </Text>
                </View>
                <View style={styles.episodeInfo}>
                  <Text style={[styles.episodeTitle, { color: selectedEpisode === idx ? "#fff" : colors.foreground }]} numberOfLines={1}>
                    {ep.title}
                  </Text>
                  <Text style={[styles.episodeDuration, { color: selectedEpisode === idx ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                    {ep.duration}
                  </Text>
                </View>
                {selectedEpisode === idx && (
                  <Feather name="play-circle" size={22} color="#fff" />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Related */}
        {related.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Similaires</Text>
            <View style={styles.relatedGrid}>
              {related.map((v) => (
                <VideoCard key={v.id} video={v} style={{ marginBottom: 16 }} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  heroContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 300,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  playOverlayBtn: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  playCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.9,
  },
  playerContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
  },
  player: {
    width: "100%",
    height: 220,
  },
  infoSection: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  metaText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  playBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 10,
    gap: 8,
  },
  playText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  favBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  favText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  episodesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 14,
  },
  episodeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  episodeNum: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  episodeNumText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  episodeDuration: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  relatedSection: {
    paddingHorizontal: 20,
  },
  relatedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
