
import { SORT_OPTIONS, SORT_ORDER, VIDEO_TYPES } from './constants';

export interface VideoItem {
  title: string;
  slug: string; // Used for detail fetching
  thumbnail: string;
  views: string;
  upload_date: string;
  duration: string;
  download_link: string;
  type: '2d' | '3d';
}

export interface PaginatedMetadata {
  last_updated: string;
  total_matches: number;
  total_pages: number;
  current_page: number;
  current_limit: number;
  message?: string;
}

export interface PaginatedResponse {
  metadata: PaginatedMetadata;
  videos: VideoItem[];
}

export interface VideoDetailResponse {
  video: VideoItem;
  similar_videos: VideoItem[];
}

export interface SearchParams {
  q?: string; // Search query
  type?: VIDEO_TYPES;
  page?: number;
  limit?: number;
  sort?: SORT_OPTIONS;
  order?: SORT_ORDER;
  min_views?: number;
  min_duration?: number;
  max_duration?: number;
  date_after?: string;
  date_before?: string;
}
