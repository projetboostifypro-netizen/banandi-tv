import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Video } from "@/data/videos";
import { useColors } from "@/hooks/useColors";
import { useFavorites } from "@/context/FavoritesContext";

const { width } = Dimensions.get("window");

interface Props {
  items: Video[];
}

export default function HeroBanner({ items }: Props) {
  const colors = useColors();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [active, setActive] = useState(0);
  const ref = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (active + 1) % items.length;
      setActive(next);
      ref.current?.scrollToIndex({ index: next, animated: true });
    }, 5000);
    return () => clearInterval(interval);
  }, [active, items.length]);

  const current = items[active];
  const fav = isFavorite(current?.id ?? 0);

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(v) => String(v.id)}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActive(idx);
        }}
        renderItem={({ item }) => (
          <Image source={{ uri: item.cover }} style={styles.image} resizeMode="cover" />
        )}
      />
      <View style={styles.gradient} />
      <View style={styles.content}>
        <View style={styles.tags}>
          {current?.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={[styles.tag, { borderColor: colors.border }]}>
              <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.title}>{current?.title}</Text>
        <Text style={styles.meta}>
          {current?.date} · {current?.duration} · {current?.country}
        </Text>
        <View style={styles.actions}>
          <Pressable
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push({ pathname: "/detail", params: { id: current?.id } });
            }}
          >
            <Feather name="play" size={18} color="#fff" />
            <Text style={styles.playText}>Regarder</Text>
          </Pressable>
          <Pressable
            style={[styles.favBtnLarge, { backgroundColor: "rgba(255,255,255,0.15)" }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (current) toggleFavorite(current);
            }}
          >
            <Feather name={fav ? "check" : "plus"} size={20} color="#fff" />
          </Pressable>
          <Pressable
            style={[styles.favBtnLarge, { backgroundColor: "rgba(255,255,255,0.15)" }]}
            onPress={() => router.push({ pathname: "/detail", params: { id: current?.id } })}
          >
            <Feather name="info" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
      <View style={styles.dots}>
        {items.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: i === active ? colors.primary : colors.muted }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: 480,
    position: "relative",
  },
  image: {
    width,
    height: 480,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    background: "linear-gradient(transparent, rgba(10,10,10,0.9))",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
  },
  tags: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  meta: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_400Regular",
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    gap: 8,
  },
  playText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  favBtnLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",
    flexDirection: "row",
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
