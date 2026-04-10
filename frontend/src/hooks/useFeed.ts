import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/services/api/posts.api';
import { QUERY_KEYS } from '@/constants';

export const useFeed = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, page, limit],
    queryFn: () => postsApi.getFeed(page, limit),
  });
};
