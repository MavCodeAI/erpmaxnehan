import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ 
  options, 
  value, 
  onChange, 
  onKeyDown, 
  placeholder = "Select or search..." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOptionLabel = useMemo(() => 
    options.find(opt => opt.value === value)?.label || '', 
    [options, value]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  useEffect(() => {
    if (isOpen && filteredOptions.length > 0) {
      setHighlightedIndex(0);
      scrollToHighlighted(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [searchTerm, isOpen, filteredOptions.length]);

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          e.preventDefault();
          selectOption(filteredOptions[highlightedIndex].value);
          const nextFocusable = findNextFocusable();
          if (nextFocusable) nextFocusable.focus();
        } else if (!isOpen && onKeyDown) {
          onKeyDown(e);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const newIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
          setHighlightedIndex(newIndex);
          scrollToHighlighted(newIndex);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const newIndex = Math.max(highlightedIndex - 1, 0);
          setHighlightedIndex(newIndex);
          scrollToHighlighted(newIndex);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        inputRef.current?.blur();
        break;
      default:
        if (!isOpen) {
          setIsOpen(true);
        }
        if (onKeyDown && !isOpen) {
          onKeyDown(e);
        }
        break;
    }
  };
  
  const scrollToHighlighted = (index: number) => {
    setTimeout(() => {
      const listElement = listRef.current;
      const highlightedElement = listElement?.children[index] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  };

  const findNextFocusable = () => {
     if (!inputRef.current) return null;
     const form = inputRef.current.closest('form');
     if (!form) return null;
     const focusable = Array.from(
        form.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')
     );
     const currentIndex = focusable.indexOf(inputRef.current);
     return (currentIndex > -1 && currentIndex < focusable.length - 1) ? focusable[currentIndex + 1] as HTMLElement : null;
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : selectedOptionLabel}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-20 text-sm bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          {value && !isOpen && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {isOpen && (
          <div className="absolute left-2 -top-2 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 px-2 py-1 text-xs text-blue-700 dark:text-blue-300 rounded shadow-sm">
            {filteredOptions.length} option{filteredOptions.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>
      {isOpen && (
        <ul ref={listRef} className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-gray-300 dark:ring-gray-600 overflow-auto focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-600">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => selectOption(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 transition-colors duration-150 ${
                  highlightedIndex === index 
                    ? 'text-white bg-blue-600 dark:bg-blue-500' 
                    : 'text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="block truncate">{option.label}</span>
                {highlightedIndex === index && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="cursor-default select-none relative py-8 px-4 text-gray-500 dark:text-gray-400 text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-500" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No items found</p>
              <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">Try a different search term</p>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
