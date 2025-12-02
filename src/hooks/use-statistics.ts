'use client';

'use client';

import { statisticsAPI } from '@/lib/api/statistics';
import type { StatisticsData } from '@/lib/types/statistics';
import { useQuery } from '@tanstack/react-query';

export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: async (): Promise<StatisticsData | null> => {
      const response = await statisticsAPI.getStatistics();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch statistics');
      }
      return response.data?.statistics || null;
    },
  });
};
