import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, onKeyDown, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOptionLabel = useMemo(() => options.find(opt => opt.value === value)?.label || '', [options, value]);

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

  const filteredOptions = useMemo(() =>
    options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ), [options, searchTerm]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm, isOpen]);

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
          // Manually trigger form navigation after selection
          const nextFocusable = findNextFocusable();
          if (nextFocusable) nextFocusable.focus();
        } else if (!isOpen && onKeyDown) {
          onKeyDown(e);
        } else if (isOpen) {
          e.preventDefault();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      default:
        if (onKeyDown && !isOpen) {
            onKeyDown(e);
        }
        break;
    }
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

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
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
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {value && !isOpen && <X className="h-4 w-4 text-gray-400 cursor-pointer" onClick={(e) => { e.stopPropagation(); onChange(''); }} />}
            <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => selectOption(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${highlightedIndex === index ? 'text-white bg-primary-600' : 'text-gray-900 dark:text-gray-200'}`}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="cursor-default select-none relative py-2 px-4 text-gray-700 dark:text-gray-300">Nothing found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
