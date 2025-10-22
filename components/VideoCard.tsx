import React, { useState } from 'react'; // Import useState
import { VideoItem } from '../types';

interface VideoCardProps {
  video: VideoItem;
  onClick: (slug: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Use a more dynamic seed for the placeholder if slug is not available
  const placeholderSeed = video.slug || Date.now().toString();
  const imageUrl = video.thumbnail || `https://picsum.photos/300/168?random=${placeholderSeed}`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!imageError) { // Only try the fallback once
      e.currentTarget.src = `https://picsum.photos/300/168?random=${placeholderSeed}`;
      setImageError(true); // Mark that we've tried the first fallback
    } else {
      // If placeholder also fails, stop trying and just ensure loading state is false
      setImageLoading(false);
      // Optionally, you could set a very minimal placeholder or hide the image entirely
      e.currentTarget.style.backgroundColor = 'transparent'; // Or another fallback
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const cleanedDownloadLink = video.download_link.replace(
    "https://mania_v1.cloud-dl.workers.dev/proxy?url=",
    ""
  );

  return (
    <div
      className="bg-gray-800 rounded-xl shadow-xl border border-blue-900 overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/60 transition-all duration-300 flex flex-col"
    >
      <img
        className={`w-full h-56 object-cover object-center cursor-pointer rounded-t-xl ${imageLoading ? 'bg-gray-800 animate-pulse' : ''}`}
        src={imageUrl}
        alt={video.title}
        loading="lazy"
        onClick={() => onClick(video.slug)} // Make image clickable for details
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-blue-300 text-xl font-semibold truncate mb-2 cursor-pointer" onClick={() => onClick(video.slug)}>{video.title}</h3>
        <div className="flex justify-between items-center text-gray-400 text-sm mb-1">
          <span>Views: {video.views}</span>
          <span>Duration: {video.duration}</span>
        </div>
        <p className="text-gray-500 text-xs mt-1 mb-4 flex-grow">Upload Date: {video.upload_date}</p>
        <div className="flex justify-between items-center mt-auto">
          <a
            href={cleanedDownloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-teal-700 transition duration-200 text-center flex-grow mr-2"
          >
            Download
          </a>
          <button
            onClick={() => onClick(video.slug)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-blue-800 transition duration-200 text-center flex-grow"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;