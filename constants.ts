
// HMV Mania API Configuration
export const API_BASE_URL = 'https://eromania.cloud-dl.workers.dev';
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
export const RETRY_COUNT = 1; // 1 retry attempt for network errors

export const API_ENDPOINTS = {
  LIST_3D: '/api/v1/3d-hmv',
  LIST_2D: '/api/v1/2d-hmv',
  RANDOM: '/api/v1/random',
  SEARCH: '/api/v1/search',
  VIDEO_DETAIL: '/api/v1/video',
  JUMP_PAGE: '/api/v1/jump',
  JUMP_RANDOM_PAGE: '/api/v1/jump_random',
};

// UI/API Filtering Options
export enum SORT_OPTIONS {
  upload_date = 'upload_date',
  title = 'title',
  views = 'views',
  duration = 'duration',
  relevance = 'relevance',
}

export enum SORT_ORDER {
  asc = 'asc',
  desc = 'desc',
}

export enum VIDEO_TYPES {
  all = 'all',
  _2d = '2d',
  _3d = '3d',
}

export enum SIMILAR_STRATEGIES {
  recent_same_type = 'recent_same_type',
  random_same_type = 'random_same_type',
}
