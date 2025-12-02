'use client';

import type { StatisticsResponse } from '@/lib/types/statistics';
import { callAPI } from '@/lib/utils/config';

const LANG = 'en';

export const statisticsAPI = {
  getStatistics: async () => {
    return callAPI<StatisticsResponse>('GET', `/api/${LANG}/home/statistics`);
  },
};
