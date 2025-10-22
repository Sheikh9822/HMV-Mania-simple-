
import { apiRequest } from './client';
import { API_ENDPOINTS, SORT_OPTIONS, SORT_ORDER, VIDEO_TYPES, SIMILAR_STRATEGIES } from '../constants';
import { PaginatedResponse, VideoItem, VideoDetailResponse, SearchParams } from '../types';

export const videoService = {
  /**
   * Fetches a paginated list of 3D videos.
   */
  async get3DVideos(
    page: number = 1,
    limit: number = 20,
    search?: string,
    sort: SORT_OPTIONS = SORT_OPTIONS.upload_date,
    order: SORT_ORDER = SORT_ORDER.desc,
  ): Promise<PaginatedResponse> {
    return apiRequest({
      url: API_ENDPOINTS.LIST_3D,
      method: 'GET',
      params: { page, limit, q: search, sort, order },
    });
  },

  /**
   * Fetches a paginated list of 2D videos.
   */
  async get2DVideos(
    page: number = 1,
    limit: number = 20,
    search?: string,
    sort: SORT_OPTIONS = SORT_OPTIONS.upload_date,
    order: SORT_ORDER = SORT_ORDER.desc,
  ): Promise<PaginatedResponse> {
    return apiRequest({
      url: API_ENDPOINTS.LIST_2D,
      method: 'GET',
      params: { page, limit, q: search, sort, order },
    });
  },

  /**
   * Fetches a single random video. Cache is skipped.
   */
  async getRandomVideo(type: VIDEO_TYPES = VIDEO_TYPES.all): Promise<VideoItem> {
    return apiRequest({
      url: API_ENDPOINTS.RANDOM,
      method: 'GET',
      params: { type },
      skipCache: true, // Bypass cache for random requests
    });
  },

  /**
   * Performs a general search query with filtering options.
   */
  async searchVideos(params: SearchParams): Promise<PaginatedResponse> {
    return apiRequest({
      url: API_ENDPOINTS.SEARCH,
      method: 'GET',
      params: params,
    });
  },

  /**
   * Fetches a single video's details along with similar videos.
   */
  async getVideoDetail(
    slug: string,
    limit: number = 15,
    similarBy: SIMILAR_STRATEGIES = SIMILAR_STRATEGIES.random_same_type,
  ): Promise<VideoDetailResponse> {
    return apiRequest({
      url: `${API_ENDPOINTS.VIDEO_DETAIL}/${slug}`,
      method: 'GET',
      params: { limit, similar_by: similarBy },
    });
  },

  /**
   * Fetches a specific page for a given video type.
   */
  async jumpToPage(
    page: number,
    limit: number = 20,
    type: VIDEO_TYPES = VIDEO_TYPES.all,
  ): Promise<PaginatedResponse> {
    return apiRequest({
      url: API_ENDPOINTS.JUMP_PAGE,
      method: 'GET',
      params: { page, limit, type },
    });
  },

  /**
   * Fetches a random page of videos. Cache is skipped.
   */
  async jumpToRandomPage(
    limit: number = 20,
    type: VIDEO_TYPES = VIDEO_TYPES.all,
  ): Promise<PaginatedResponse> {
    return apiRequest({
      url: API_ENDPOINTS.JUMP_RANDOM_PAGE,
      method: 'GET',
      params: { limit, type },
      skipCache: true, // Bypass cache for random requests
    });
  },
};
