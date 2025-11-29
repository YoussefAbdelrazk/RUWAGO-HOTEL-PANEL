'use client';

import type { Facility } from '@/lib/types/auth';
import { callClientAPI } from '@/lib/utils/client-api';

const LANG = 'en';

interface FacilitiesResponse {
  facilities: Facility[];
}

export const facilitiesAPI = {
  getAll: async () => {
    return callClientAPI<FacilitiesResponse>('GET', `/api/${LANG}/facilities`);
  },
};
