import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Video } from "@/data/videos";

interface FavoritesContextType {
  favorites: Video[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (video: Video) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const STORAGE_KEY = "@banandi_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Video[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setFavorites(JSON.parse(raw));
    });
  }, []);

  function isFavorite(id: number) {
    return favorites.some((v) => v.id === id);
  }

  function toggleFavorite(video: Video) {
    setFavorites((prev) => {
      let next: Video[];
      if (prev.some((v) => v.id === video.id)) {
        next = prev.filter((v) => v.id !== video.id);
      } else {
        next = [video, ...prev];
      }
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
