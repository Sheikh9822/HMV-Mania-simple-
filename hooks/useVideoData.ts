import { useState, useEffect, useCallback } from 'react';
import { videoService } from '../api/videoService';
import { PaginatedResponse, VideoItem, SearchParams } from '../types';
import { DEFAULT_LIMIT, DEFAULT_PAGE, SORT_ORDER, SORT_OPTIONS, VIDEO_TYPES } from '../constants';

interface UseVideoDataOptions {
  // Fix: Changed type from '2d' | '3d' to VIDEO_TYPES for correct enum assignment.
  initialVideoType: VIDEO_TYPES; // Initial type when component mounts, not 'search'
}

interface VideoDataState {
  videos: VideoItem[];
  metadata: PaginatedResponse['metadata'] | null;
  loading: boolean;
  error: string | null;
}

const initialVideoDataState: VideoDataState = {
  videos: [],
  metadata: null,
  loading: false,
  error: null,
};

const useVideoData = ({ initialVideoType }: UseVideoDataOptions) => {
  // Fix: Explicitly set the initial state to '2d' or '3d' string literal
  // matching the `currentViewType` union type, based on `initialVideoType` enum member.
  const [currentViewType, setCurrentViewType] = useState<'2d' | '3d' | 'search'>(
    initialVideoType === VIDEO_TYPES._2d ? '2d' : '3d'
  );
  const [searchParams, setSearchParams] = useState<SearchParams>({
    q: '',
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    sort: SORT_OPTIONS.upload_date,
    order: SORT_ORDER.desc,
    // Fix: `initialVideoType` is now of type `VIDEO_TYPES`, so this assignment is valid.
    type: initialVideoType, // Initialize type in searchParams
  });

  const [data, setData] = useState<VideoDataState>(initialVideoDataState);

  const fetchVideos = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }));
    try {
      let response: PaginatedResponse;
      if (currentViewType === '2d') {
        response = await videoService.get2DVideos(
          searchParams.page!,
          searchParams.limit!,
          searchParams.q || undefined,
          searchParams.sort,
          searchParams.order
        );
      } else if (currentViewType === '3d') {
        response = await videoService.get3DVideos(
          searchParams.page!,
          searchParams.limit!,
          searchParams.q || undefined,
          searchParams.sort,
          searchParams.order
        );
      } else { // 'search'
        response = await videoService.searchVideos(searchParams);
      }
      setData({
        videos: response.videos,
        metadata: response.metadata,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Error fetching videos:", err);
      setData({
        ...initialVideoDataState,
        loading: false,
        error: err.message || 'Failed to fetch videos.',
      });
    }
  }, [currentViewType, searchParams]); // currentViewType and searchParams are dependencies

  // Effect to trigger fetch when relevant searchParams or viewType change
  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentViewType, searchParams.q, searchParams.page, searchParams.limit, searchParams.sort, searchParams.order, searchParams.type]);

  const handlePageChange = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }, []);

  const handleSearchSubmit = useCallback((params: SearchParams) => {
    setCurrentViewType('search');
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  // Fix: Changed parameter `type` to accept specific VIDEO_TYPES enum members.
  const setViewType = useCallback((type: VIDEO_TYPES._2d | VIDEO_TYPES._3d) => {
    // Fix: Update currentViewType state with the corresponding string literal.
    setCurrentViewType(type === VIDEO_TYPES._2d ? '2d' : '3d');
    setSearchParams({
      q: '',
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      sort: SORT_OPTIONS.upload_date,
      order: SORT_ORDER.desc,
      // Fix: `type` is now a `VIDEO_TYPES` member, so this assignment is valid.
      type: type, // Ensure the correct type is set for API call
    });
  }, []);

  const handleClearSearch = useCallback(() => {
    // Fix: Revert current view type to the appropriate string literal from initialVideoType
    setCurrentViewType(initialVideoType === VIDEO_TYPES._2d ? '2d' : '3d'); // Revert to initial view type
    setSearchParams({
      q: '',
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      sort: SORT_OPTIONS.upload_date,
      order: SORT_ORDER.desc,
      // Fix: `initialVideoType` is now of type `VIDEO_TYPES`, so this assignment is valid.
      type: initialVideoType,
    });
  }, [initialVideoType]);

  return {
    videos: data.videos,
    metadata: data.metadata,
    loading: data.loading,
    error: data.error,
    currentPage: searchParams.page!,
    totalPages: data.metadata?.total_pages || 1,
    currentSearchParams: searchParams,
    currentViewType,
    handlePageChange,
    handleSearchSubmit,
    setViewType,
    handleClearSearch,
  };
};

export default useVideoData;