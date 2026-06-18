import { httpGet } from '@repo/shared/api';
import type { NHTSADecodeResponse } from '../model/types.js';

const BASE_URL = 'https://vpic.nhtsa.dot.gov/api';

export async function decodeVin(vin: string): Promise<NHTSADecodeResponse> {
  return httpGet<NHTSADecodeResponse>(
    `${BASE_URL}/vehicles/decodevin/${vin.toUpperCase()}?format=json`
  );
}
