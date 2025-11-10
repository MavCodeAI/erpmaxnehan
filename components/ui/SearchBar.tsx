import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'invoice' | 'customer' | 'vendor' | 'item';
  title: string;
  subtitle: string;
  path: string;
}

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search... (Ctrl+K)' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Mock search function (replace with actual search logic)
  const performSearch = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const mockResults: SearchResult[] = [
      { id: '1', type: 'invoice', title: 'INV-001', subtitle: 'Customer: John Doe - PKR 15,000', path: '/sales/invoices/1' },
      { id: '2', type: 'customer', title: 'AKBER ALI LHR', subtitle: 'Balance: PKR 2,500', path: '/sales/customers/1' },
      { id: '3', type: 'vendor', title: 'Global Tech Supplies', subtitle: 'Balance: PKR 15,000', path: '/purchases/vendors/1' },
      { id: '4', type: 'item', title: 'Office Chair', subtitle: 'SKU: OC-001 - Stock: 50', path: '/inventory/items/1' },
    ];

    return mockResults.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    const results = performSearch(query);
    setResults(results);
    setSelectedIndex(0);
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }

      // Arrow navigation
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (results[selectedIndex]) {
            navigate(results[selectedIndex].path);
            setIsOpen(false);
            setQuery('');
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, navigate]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      invoice: '📄',
      customer: '👤',
      vendor: '🏢',
      item: '📦',
    };
    return icons[type] || '📋';
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border-0 rounded-lg dark:placeholder-gray-400 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 max-h-[70vh] sm:max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleResultClick(result)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      index === selectedIndex ? 'bg-gray-50 dark:bg-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="text-xl sm:text-2xl mr-2 sm:mr-3">{getTypeIcon(result.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {result.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </p>
                      </div>
                      <span className="ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hidden sm:inline">
                        {result.type}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for invoices, customers, vendors, or items</p>
            </div>
          )}

          {/* Search Tips */}
          <div className="px-3 sm:px-4 py-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hidden sm:block">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>💡 Tip: Use Ctrl+K to quick search</span>
              <div className="flex gap-2">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border dark:border-gray-600">↑↓</kbd>
                <span>to navigate</span>
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border dark:border-gray-600">Enter</kbd>
                <span>to select</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
