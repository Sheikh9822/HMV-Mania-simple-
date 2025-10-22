import React, { useState, useEffect, useCallback } from 'react';
import { SearchParams } from '../types';
import { SORT_OPTIONS, SORT_ORDER, VIDEO_TYPES } from '../constants';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  initialSearchParams: SearchParams;
  onClearSearch: () => void;
  currentVideoType: '2d' | '3d' | 'search';
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialSearchParams, onClearSearch, currentVideoType }) => {
  const [query, setQuery] = useState(initialSearchParams.q || '');
  const [sort, setSort] = useState(initialSearchParams.sort || SORT_OPTIONS.upload_date);
  const [order, setOrder] = useState(initialSearchParams.order || SORT_ORDER.desc);
  const [videoTypeFilter, setVideoTypeFilter] = useState(initialSearchParams.type || VIDEO_TYPES.all);

  // Update internal state when initialSearchParams change (e.g., when switching tabs)
  useEffect(() => {
    setQuery(initialSearchParams.q || '');
    setSort(initialSearchParams.sort || SORT_OPTIONS.upload_date);
    setOrder(initialSearchParams.order || SORT_ORDER.desc);
    setVideoTypeFilter(initialSearchParams.type || VIDEO_TYPES.all);
  }, [initialSearchParams]);

  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch({
      q: query.trim() || undefined,
      sort,
      order,
      type: videoTypeFilter,
      page: 1, // Always reset to page 1 on new search
    });
  }, [query, sort, order, videoTypeFilter, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setSort(SORT_OPTIONS.upload_date);
    setOrder(SORT_ORDER.desc);
    setVideoTypeFilter(VIDEO_TYPES.all);
    onClearSearch();
  }, [onClearSearch]);

  const isSearchActive = query.trim() !== '' ||
                         sort !== SORT_OPTIONS.upload_date ||
                         order !== SORT_ORDER.desc ||
                         videoTypeFilter !== VIDEO_TYPES.all;

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl border border-blue-900 mb-8">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos..."
          className="flex-grow p-3 rounded-lg bg-gray-800 text-blue-200 border border-blue-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition duration-200"
        />

        <select
          value={videoTypeFilter}
          onChange={(e) => setVideoTypeFilter(e.target.value as VIDEO_TYPES)}
          className="p-3 rounded-lg bg-gray-800 text-blue-200 border border-blue-700 focus:outline-none focus:border-purple-500 transition duration-200"
        >
          {Object.values(VIDEO_TYPES).map((type) => (
            <option key={type} value={type}>
              Type: {type.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SORT_OPTIONS)}
          className="p-3 rounded-lg bg-gray-800 text-blue-200 border border-blue-700 focus:outline-none focus:border-purple-500 transition duration-200"
        >
          {Object.values(SORT_OPTIONS).map((option) => (
            <option key={option} value={option}>
              Sort by: {option.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as SORT_ORDER)}
          className="p-3 rounded-lg bg-gray-800 text-blue-200 border border-gray-700 focus:outline-none focus:border-blue-500 transition duration-200"
        >
          {Object.values(SORT_ORDER).map((option) => (
            <option key={option} value={option}>
              Order: {option.toUpperCase()}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-800 transition duration-200"
        >
          Search
        </button>
        {isSearchActive && currentVideoType === 'search' && (
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-3 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition duration-200"
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;