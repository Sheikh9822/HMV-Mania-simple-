import React, { useState, useCallback } from 'react';
import useVideoData from './hooks/useVideoData';
import VideoListView from './components/VideoListView';
import RandomVideoView from './components/RandomVideoView';
import VideoDetailView from './components/VideoDetailView';
import { VIDEO_TYPES } from './constants'; // Import VIDEO_TYPES

type AppView = '2d' | '3d' | 'random' | 'search';

const App: React.FC = () => {
  const [currentAppView, setCurrentAppView] = useState<AppView>('2d');
  const [selectedVideoSlug, setSelectedVideoSlug] = useState<string | null>(null);

  // Fix: Pass VIDEO_TYPES._2d as the initialVideoType to the hook.
  const {
    videos,
    metadata,
    loading,
    error,
    currentPage,
    totalPages,
    currentSearchParams,
    currentViewType,
    handlePageChange,
    handleSearchSubmit,
    setViewType,
    handleClearSearch,
  } = useVideoData({ initialVideoType: VIDEO_TYPES._2d });

  const handleVideoCardClick = useCallback((slug: string) => {
    setSelectedVideoSlug(slug);
  }, []);

  const handleCloseDetailView = useCallback(() => {
    setSelectedVideoSlug(null);
  }, []);

  const renderContent = () => {
    switch (currentAppView) {
      case 'random':
        return <RandomVideoView onVideoClick={handleVideoCardClick} />;
      case '2d':
      case '3d':
      case 'search':
      default:
        return (
          <VideoListView
            videos={videos}
            metadata={metadata}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            currentSearchParams={currentSearchParams}
            currentViewType={currentViewType}
            onPageChange={handlePageChange}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={handleClearSearch}
            onVideoClick={handleVideoCardClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="bg-gray-900 shadow-lg p-6 sticky top-0 z-40 border-b border-blue-900">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 sm:mb-0">HMV Mania</h1>
          <nav className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setCurrentAppView('2d');
                // Fix: Call setViewType with VIDEO_TYPES._2d enum member.
                setViewType(VIDEO_TYPES._2d);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition duration-200 border border-blue-800 ${
                (currentAppView === '2d' || (currentAppView === 'search' && currentViewType === '2d'))
                  ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-md shadow-blue-500/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-blue-300'
              }`}
            >
              2D Videos
            </button>
            <button
              onClick={() => {
                setCurrentAppView('3d');
                // Fix: Call setViewType with VIDEO_TYPES._3d enum member.
                setViewType(VIDEO_TYPES._3d);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition duration-200 border border-blue-800 ${
                (currentAppView === '3d' || (currentAppView === 'search' && currentViewType === '3d'))
                  ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-md shadow-blue-500/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-blue-300'
              }`}
            >
              3D Videos
            </button>
            <button
              onClick={() => setCurrentAppView('random')}
              className={`px-6 py-3 rounded-xl font-medium transition duration-200 border border-blue-800 ${
                currentAppView === 'random' ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md shadow-green-500/50' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-blue-300'
              }`}
            >
              Random Video
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {renderContent()}
      </main>

      {selectedVideoSlug && (
        <VideoDetailView slug={selectedVideoSlug} onClose={handleCloseDetailView} onVideoClick={handleVideoCardClick} />
      )}
    </div>
  );
};

export default App;