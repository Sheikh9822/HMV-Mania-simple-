import React from 'react';
import { VideoItem, PaginatedMetadata, SearchParams } from '../types';
import VideoCard from './VideoCard';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import SearchBar from './SearchBar';

interface VideoListViewProps {
  videos: VideoItem[];
  metadata: PaginatedMetadata | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  currentSearchParams: SearchParams;
  currentViewType: '2d' | '3d' | 'search';
  onPageChange: (page: number) => void;
  onSearchSubmit: (params: SearchParams) => void;
  onClearSearch: () => void;
  onVideoClick: (slug: string) => void;
}

const VideoListView: React.FC<VideoListViewProps> = ({
  videos,
  metadata,
  loading,
  error,
  currentPage,
  totalPages,
  currentSearchParams,
  currentViewType,
  onPageChange,
  onSearchSubmit,
  onClearSearch,
  onVideoClick,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar
        onSearch={onSearchSubmit}
        initialSearchParams={currentSearchParams}
        onClearSearch={onClearSearch}
        currentVideoType={currentViewType}
      />

      {loading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-800 text-white p-4 rounded-lg mb-6 text-center">
          Error: {error}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="text-white text-center text-xl mt-12">
          No videos found for your criteria. Try adjusting your search!
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {videos.map((video) => (
              <VideoCard key={video.slug} video={video} onClick={onVideoClick} />
            ))}
          </div>
          {metadata && metadata.total_pages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VideoListView;