import React, { useState, useEffect, useCallback } from 'react';
import { videoService } from '../api/videoService';
import { VideoDetailResponse } from '../types';
import LoadingSpinner from './LoadingSpinner';
import VideoCard from './VideoCard';
import { SIMILAR_STRATEGIES } from '../constants';

interface VideoDetailViewProps {
  slug: string;
  onClose: () => void;
  onVideoClick: (slug: string) => void; // For similar videos
}

const VideoDetailView: React.FC<VideoDetailViewProps> = ({ slug, onClose, onVideoClick }) => {
  const [videoDetail, setVideoDetail] = useState<VideoDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for image loading within the detail view
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const fetchVideoDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    setImageError(false); // Reset image error state for new video
    setImageLoading(true); // Reset image loading state for new video
    try {
      const detail = await videoService.getVideoDetail(slug);
      console.log('Fetched video detail:', detail); // Debugging: log the fetched detail
      setVideoDetail(detail);
    } catch (err: any) {
      console.error("Error fetching video details:", err);
      setError(err.message || 'Failed to fetch video details.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchVideoDetail();
  }, [fetchVideoDetail]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!imageError) { // Only try the fallback once
      e.currentTarget.src = `https://picsum.photos/640/360?random=${slug}`; // Use slug for consistent placeholder
      setImageError(true); // Mark that we've tried the first fallback
    } else {
      // If placeholder also fails, stop trying and just ensure loading state is false
      setImageLoading(false);
      e.currentTarget.style.backgroundColor = 'transparent'; // Or another minimal fallback
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gray-800 rounded-lg p-6 text-white text-center shadow-xl border border-red-700">
          <p className="text-lg mb-4">Error: {error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Handle case where no videoDetail is returned after loading, but no explicit error
  if (!videoDetail || !videoDetail.video) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gray-800 rounded-lg p-6 text-white text-center shadow-xl border border-purple-700">
          <p className="text-lg mb-4">No details found for this video. It might have been removed or an issue occurred.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const { video, similar_videos } = videoDetail;
  const imageUrl = video.thumbnail || `https://picsum.photos/640/360?random=${video.slug || Date.now().toString()}`; // Use slug or a dynamic seed for placeholder

  const cleanedDownloadLink = video.download_link.replace(
    "https://mania_v1.cloud-dl.workers.dev/proxy?url=",
    ""
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl shadow-blue-950/70 max-w-4xl w-full relative border border-purple-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-4xl font-bold leading-none z-10"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="p-6">
          <h2 className="text-white text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{video.title}</h2>
          
          {/* Video Player Placeholder Section */}
          <div className="bg-gray-800 p-8 rounded-lg mb-6 border border-blue-700 flex items-center justify-center h-64">
            <p className="text-gray-400 text-center text-lg">
              Video Player Placeholder - Streaming URL not available from API.<br/>
              To enable, the API needs to provide a direct video streaming link.
            </p>
          </div>

          <img
            className={`w-full h-auto object-cover rounded-lg mb-6 border border-blue-800 ${imageLoading ? 'bg-gray-800 animate-pulse' : ''}`}
            src={imageUrl}
            alt={video.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm mb-6">
            <div>
              <p><span className="font-semibold">Views:</span> {video.views}</p>
              <p><span className="font-semibold">Duration:</span> {video.duration}</p>
            </div>
            <div>
              <p><span className="font-semibold">Upload Date:</span> {video.upload_date}</p>
              <p><span className="font-semibold">Type:</span> {video.type.toUpperCase()}</p>
            </div>
          </div>

          <a
            href={cleanedDownloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-700 transition duration-200 mb-8"
          >
            Download Video
          </a>

          {/* Description Section */}
          <div className="mb-6">
            <h3 className="text-blue-300 text-xl font-bold mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed bg-gray-800 p-4 rounded-lg border border-blue-900">
              {/* Placeholder text */}
              This is a placeholder for the video description. Currently, the API does not provide a 'description' field. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Tags Section */}
          <div className="mb-6">
            <h3 className="text-blue-300 text-xl font-bold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {/* Placeholder tags */}
              <span className="bg-purple-800 text-purple-200 px-3 py-1 rounded-full text-sm">Sci-Fi</span>
              <span className="bg-purple-800 text-purple-200 px-3 py-1 rounded-full text-sm">Futuristic</span>
              <span className="bg-purple-800 text-purple-200 px-3 py-1 rounded-full text-sm">Action</span>
              <span className="bg-purple-800 text-purple-200 px-3 py-1 rounded-full text-sm">Adventure</span>
              <span className="bg-purple-800 text-purple-200 px-3 py-1 rounded-full text-sm">Exploration</span>
            </div>
          </div>

          {/* Uploader Section */}
          <div className="mb-6">
            <h3 className="text-blue-300 text-xl font-bold mb-2">Uploader</h3>
            <p className="text-gray-300 bg-gray-800 p-4 rounded-lg border border-blue-900">
              {/* Placeholder text */}
              Uploader Name: Unknown (API does not provide 'uploader' field)
            </p>
          </div>


          {similar_videos && similar_videos.length > 0 && (
            <div className="mt-8 pt-8 border-t border-blue-800">
              <h3 className="text-white text-2xl font-bold mb-6 text-blue-300">Similar Videos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar_videos.map((sVideo) => (
                  <VideoCard key={sVideo.slug} video={sVideo} onClick={onVideoClick} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetailView;