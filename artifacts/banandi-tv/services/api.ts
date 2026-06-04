/**
 * Banandi TV — API Service
 * Extracted from MovieFR APK (jgzm.iuk9.com) via ZIP analysis.
 *
 * Data models match the decompiled Java classes:
 *   RecommandVideosEntity, SeriesInfoEntry, VideoBean, TKBean, HomeVideoPageEntry
 */

const BASE_URL = "https://jgzm.iuk9.com";

export interface SeriesInfoEntry {
  vod_id: number;
  series: string;
  default: boolean;
}

export interface VideoBean {
  vod_id: number;
  title: string;
  vod_url: string;
  down_url?: string;
  orginal_url?: string;
  source_id?: number;
  episodeNum?: number;
  is_ad?: number;
  is_p2p?: number;
}

export interface RecommandVideosEntity {
  id: number;
  name: string;
  vod_name?: string;
  coverUrl?: string;
  vod_pic?: string;
  vod_year?: string;
  vod_area?: string;
  vod_actor?: string;
  vod_director?: string;
  vod_douban_score?: string;
  vod_blurb?: string;
  vod_tag?: string;
  vod_serial?: string;
  vod_total?: string;
  vod_isend?: number;
  vod_is_update?: number;
  type_id?: number;
  type_pid?: number;
  videoType?: number;
  remarks?: string;
  simpleDesc?: string;
  series_info?: SeriesInfoEntry[];
  vod_collection?: VideoBean[];
  audio_language_tag?: string;
}

export interface HomeVideoPageEntry {
  list: RecommandVideosEntity[];
  pageNum: number;
  total: number;
  isHasNextPage: boolean;
}

export interface ApiResponse<T> {
  code: number;
  msg?: string;
  data?: T;
}

export interface UserInfoEntry {
  id: string;
  nickname: string;
  head_img: string;
  email?: string;
  is_vip: boolean;
  is_svip: boolean;
  vip_level: number;
  ck?: string;
}

export interface LoginUserEntity {
  token: string;
  user: UserInfoEntry;
}

let _ck: string | null = null;
let _token: string | null = null;

export function setAuthCredentials(ck: string | null, token: string | null) {
  _ck = ck;
  _token = token;
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "BanandiTV/3.0.2 Android",
  };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;
  if (_ck) headers["ck"] = _ck;
  return headers;
}

async function get<T>(path: string, params: Record<string, string | number> = {}): Promise<T | null> {
  try {
    const qs = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    const url = `${BASE_URL}${path}${qs ? "?" + qs : ""}`;
    const res = await fetch(url, { headers: buildHeaders() });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.code === 0 || json.code === 200) return json.data as T;
    return null;
  } catch {
    return null;
  }
}

async function post<T>(path: string, body: Record<string, unknown> = {}): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.code === 0 || json.code === 200) return json.data as T;
    return null;
  } catch {
    return null;
  }
}

export const api = {
  /** Home page videos — trending, new, recommended */
  async getHomePage(page = 1): Promise<HomeVideoPageEntry | null> {
    return get<HomeVideoPageEntry>("/app/home/list", { pg: page });
  },

  /** All videos with optional category filter */
  async getVideoList(page = 1, typeId?: number): Promise<HomeVideoPageEntry | null> {
    const params: Record<string, string | number> = { pg: page };
    if (typeId) params.type_id = typeId;
    return get<HomeVideoPageEntry>("/app/vod/list", params);
  },

  /** Search videos by keyword */
  async search(keyword: string, page = 1): Promise<HomeVideoPageEntry | null> {
    return get<HomeVideoPageEntry>("/app/search", { wd: keyword, pg: page });
  },

  /** Video detail — includes series_info and vod_collection for episodes */
  async getDetail(vodId: number): Promise<RecommandVideosEntity | null> {
    return get<RecommandVideosEntity>("/app/vod/detail", { vod_id: vodId });
  },

  /** Hot search terms */
  async getHotSearch(): Promise<{ word: string; sort: number }[] | null> {
    return get("/app/search/hot");
  },

  /** Categories / channel types */
  async getCategories(): Promise<{ id: number; name: string }[] | null> {
    return get("/app/channel/type");
  },

  /** Rank list */
  async getRank(typeId?: number): Promise<RecommandVideosEntity[] | null> {
    const params: Record<string, string | number> = {};
    if (typeId) params.type_id = typeId;
    return get("/app/rank/list", params);
  },

  /** User login */
  async login(
    email: string,
    password: string
  ): Promise<LoginUserEntity | null> {
    return post<LoginUserEntity>("/app/user/login", { email, password });
  },

  /** User register */
  async register(
    nickname: string,
    email: string,
    password: string
  ): Promise<LoginUserEntity | null> {
    return post<LoginUserEntity>("/app/user/register", {
      nickname,
      email,
      password,
    });
  },

  /** Get user info */
  async getUserInfo(): Promise<UserInfoEntry | null> {
    return get<UserInfoEntry>("/app/user/info");
  },

  /** Add to favorites */
  async addFavorite(vodId: number): Promise<boolean> {
    const res = await post("/app/collect/add", { vod_id: vodId });
    return res !== null;
  },

  /** Remove from favorites */
  async removeFavorite(vodId: number): Promise<boolean> {
    const res = await post("/app/collect/del", { vod_id: vodId });
    return res !== null;
  },

  /** Get user's favorites */
  async getFavorites(page = 1): Promise<HomeVideoPageEntry | null> {
    return get<HomeVideoPageEntry>("/app/collect/list", { pg: page });
  },
};

/**
 * Build the proxied video URL (as seen in TKBean.java).
 * For m3u8: /resource.m3u8?src={vod_url}&type=12&tb={tb}&te={te}
 * For mp4:  /resource.mp4?src={vod_url}&type=12&tb={tb}&te={te}
 *
 * In the app, the local port proxy handles DRM/decryption.
 * For Expo we pass the raw vod_url directly.
 */
export function buildVideoUrl(vodUrl: string, format?: string): string {
  if (!vodUrl) return "";
  if (vodUrl.startsWith("http")) return vodUrl;
  return `${BASE_URL}${vodUrl}`;
}

/** Map a RecommandVideosEntity to the app's Video type */
export function mapToVideo(e: RecommandVideosEntity): import("../data/videos").Video {
  const name = e.vod_name || e.name || "";
  const cover = e.vod_pic || e.coverUrl || "";
  const score = parseFloat(e.vod_douban_score || "0") || 0;

  const episodes =
    e.series_info && e.series_info.length > 0
      ? e.series_info.map((s, i) => ({
          id: s.vod_id || i,
          title: s.series || `Épisode ${i + 1}`,
          episodeNum: i + 1,
          duration: "45min",
          vod_url: "",
          thumbnail: cover,
        }))
      : e.vod_collection && e.vod_collection.length > 0
      ? e.vod_collection.map((b, i) => ({
          id: b.vod_id || i,
          title: b.title || `Épisode ${i + 1}`,
          episodeNum: b.episodeNum || i + 1,
          duration: "45min",
          vod_url: buildVideoUrl(b.vod_url || ""),
          thumbnail: cover,
        }))
      : undefined;

  const isMovie =
    (e.videoType === 1 || e.type_pid === 1) && !episodes?.length;

  return {
    id: e.id,
    title: name,
    cover: cover || "https://via.placeholder.com/300x450?text=Banandi+TV",
    description: e.vod_blurb || e.simpleDesc || e.remarks || "",
    category: e.vod_tag || e.vod_area || "Autre",
    categoryId: e.type_id || e.type_pid || 0,
    date: e.vod_year || "",
    rating: score,
    duration: e.vod_total || (isMovie ? "1h 30min" : ""),
    type: isMovie ? "movie" : "series",
    play_url: "",
    episodes,
    isFree: true,
    views: "",
    country: e.vod_area || "",
    tags: e.vod_tag ? e.vod_tag.split(",").map((t) => t.trim()) : [],
  };
}
