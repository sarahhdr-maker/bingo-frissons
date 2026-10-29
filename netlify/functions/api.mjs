import { getStore } from '@netlify/blobs';
import { handle } from '../lib/bingo.mjs';

export default async (req) => {
  const store = getStore({ name: 'bingo-frissons', consistency: 'strong' });
  return handle(req, store, process.env.ORGA_CODE || 'FRISSONS');
};

export const config = { path: '/api/*' };
