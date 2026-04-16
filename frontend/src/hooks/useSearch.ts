'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/services/api/users.api';
import { QUERY_KEYS, UI_CONSTANTS } from '@/constants';

export const useSearch = (initialValue: string = '', limit: number = 5) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, UI_CONSTANTS.SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handler);
  }, [searchValue]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH, debouncedValue, limit],
    queryFn: () => usersApi.searchUsers(debouncedValue, 1, limit),
    enabled: debouncedValue.length > 0 && isOpen,
    staleTime: 1000 * 60 * 5, // Cache kết quả tìm kiếm trong 5 phút
  });

  return {
    searchValue,
    setSearchValue,
    debouncedValue,
    isOpen,
    setIsOpen,
    results: data?.data || [],
    isLoading,
    isError,
    clearSearch: () => {
      setSearchValue('');
      setIsOpen(false);
    }
  };
};
