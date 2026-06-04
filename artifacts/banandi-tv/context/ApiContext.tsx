/**
 * ApiContext — manages fetching real data from jgzm.iuk9.com
 * Falls back to local static data when the API is unreachable.
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import { api, mapToVideo, RecommandVideosEntity } from "../services/api";
import { VIDEOS, Video } from "../data/videos";

interface ApiState {
  homeVideos: Video[];
  trendingVideos: Video[];
  newVideos: Video[];
  seriesVideos: Video[];
  isLoading: boolean;
  isApiLive: boolean;
  search: (query: string) => Promise<Video[]>;
  getDetail: (id: number) => Promise<Video | null>;
  refresh: () => Promise<void>;
}

const ApiContext = createContext<ApiState | undefined>(undefined);

function mapAll(entities: RecommandVideosEntity[]): Video[] {
  return entities.map(mapToVideo).filter((v) => v.title.length > 0);
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [homeVideos, setHomeVideos] = useState<Video[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [newVideos, setNewVideos] = useState<Video[]>([]);
  const [seriesVideos, setSeriesVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiLive, setIsApiLive] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [home, all] = await Promise.all([
        api.getHomePage(1),
        api.getVideoList(1),
      ]);

      if (home?.list && home.list.length > 0) {
        setIsApiLive(true);
        const mapped = mapAll(home.list);
        setHomeVideos(mapped);
        setTrendingVideos(mapped.slice(0, 10));
        setNewVideos(
          mapped.filter((v) => v.date >= "2023").slice(0, 10)
        );
        setSeriesVideos(mapped.filter((v) => v.type === "series").slice(0, 10));
      } else {
        useFallback();
      }

      if (all?.list && all.list.length > 0 && !isApiLive) {
        setIsApiLive(true);
        const mapped = mapAll(all.list);
        setHomeVideos((prev) => (prev.length ? prev : mapped));
      }
    } catch {
      useFallback();
    } finally {
      setIsLoading(false);
    }
  }

  function useFallback() {
    setIsApiLive(false);
    setHomeVideos(VIDEOS);
    setTrendingVideos(VIDEOS.slice(0, 8));
    setNewVideos(VIDEOS.filter((v) => v.type === "movie").slice(0, 8));
    setSeriesVideos(VIDEOS.filter((v) => v.type === "series").slice(0, 8));
  }

  async function search(query: string): Promise<Video[]> {
    if (!query.trim()) return [];
    if (isApiLive) {
      const res = await api.search(query);
      if (res?.list && res.list.length > 0) return mapAll(res.list);
    }
    // Fallback: local search
    const q = query.toLowerCase();
    return VIDEOS.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  async function getDetail(id: number): Promise<Video | null> {
    if (isApiLive) {
      const detail = await api.getDetail(id);
      if (detail) return mapToVideo(detail);
    }
    return VIDEOS.find((v) => v.id === id) || null;
  }

  return (
    <ApiContext.Provider
      value={{
        homeVideos,
        trendingVideos,
        newVideos,
        seriesVideos,
        isLoading,
        isApiLive,
        search,
        getDetail,
        refresh: loadData,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used inside ApiProvider");
  return ctx;
}
