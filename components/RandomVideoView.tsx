import React, { useState, useEffect, useCallback } from 'react';
import { videoService } from '../api/videoService';
import { VideoItem } from '../types';
import { VIDEO_TYPES } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface RandomVideoViewProps {
  onVideoClick: (slug: string) => void;
}

const RandomVideoView: React.FC<RandomVideoViewProps> = ({ onVideoClick }) => {
  const [randomVideo, setRandomVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<VIDEO_TYPES>(VIDEO_TYPES.all);

  // States for image loading within the random video view
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const fetchRandomVideo = useCallback(async (type: VIDEO_TYPES) => {
    setLoading(true);
    setError(null);
    setRandomVideo(null);
    setImageError(false); // Reset image error state for new video
    setImageLoading(true); // Reset image loading state for new video
    try {
      const video = await videoService.getRandomVideo(type);
      console.log('Fetched random video:', video); // Debugging: log the fetched video
      setRandomVideo(video);
    } catch (err: any) {
      console.error("Error fetching random video:", err);
      setError(err.message || 'Failed to fetch a random video.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomVideo(selectedType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]); // Refetch when selectedType changes

  const handleGetAnotherRandom = useCallback(() => {
    fetchRandomVideo(selectedType);
  }, [fetchRandomVideo, selectedType]);

  // Use a more dynamic seed for the placeholder if slug is not available
  const placeholderSeed = randomVideo?.slug || Date.now().toString();
  const imageUrl = randomVideo?.thumbnail || `https://picsum.photos/600/338?random=${placeholderSeed}`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!imageError) { // Only try the fallback once
      e.currentTarget.src = `https://picsum.photos/600/338?random=${placeholderSeed}`;
      setImageError(true); // Mark that we've tried the first fallback
    } else {
      // If placeholder also fails, stop trying and just ensure loading state is false
      setImageLoading(false);
      e.currentTarget.style.backgroundColor = 'transparent';
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const cleanedDownloadLink = randomVideo?.download_link?.replace(
    "https://mania_v1.cloud-dl.workers.dev/proxy?url=",
    ""
  ) || '';


  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h2 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Random Video</h2>

      <div className="flex justify-center items-center gap-4 mb-8">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as VIDEO_TYPES)}
          className="p-3 rounded-lg bg-gray-800 text-blue-200 border border-blue-700 focus:outline-none focus:border-purple-500 transition duration-200"
        >
          {Object.values(VIDEO_TYPES).map((type) => (
            <option key={type} value={type}>
              Type: {type.toUpperCase()}
            </option>
          ))}
        </select>
        <button
          onClick={handleGetAnotherRandom}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-green-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-green-700 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Getting...' : 'Get Another Random Video'}
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-800 text-white p-4 rounded-lg mb-6 text-center">
          Error: {error}
        </div>
      )}

      {!loading && !error && randomVideo && (
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl border border-blue-900 overflow-hidden">
          <img
            key={randomVideo.slug || `random-placeholder-${placeholderSeed}`}
            className={`w-full h-auto object-cover object-center ${imageLoading ? 'bg-gray-800 animate-pulse' : ''}`}
            src={imageUrl}
            alt={randomVideo.title}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          <div className="p-6">
            <h3 className="text-white text-2xl font-bold mb-3">{randomVideo.title}</h3>
            <div className="flex justify-between items-center text-gray-400 text-sm mb-2">
              <span>Views: {randomVideo.views}</span>
              <span>Duration: {randomVideo.duration}</span>
              <span>Type: {randomVideo.type.toUpperCase()}</span>
            </div>
            <p className="text-gray-500 text-xs mb-4">Upload Date: {randomVideo.upload_date}</p>
            <div className="flex justify-between items-center">
              <a
                href={cleanedDownloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-700 transition duration-200"
              >
                Download
              </a>
              <button
                onClick={() => onVideoClick(randomVideo.slug)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-800 transition duration-200"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomVideoView;