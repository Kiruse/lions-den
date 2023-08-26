import { Buffer } from 'buffer'
import config from './config';

const COSMOS_LINK_URL = config.cosmosLinkUri || 'https://cosmos-link.kiruse.dev/'

export const getCosmosLinkURL = (path: string) => COSMOS_LINK_URL + path.replace(/^\//, '');

export function getJWTPayload(token: string) {
  const [, payloadB64] = token.split('.');
  try {
    return JSON.parse(Buffer.from(payloadB64, 'base64').toString());
  } catch (err: any) {
    console.error("Failed to get JWT payload:", err);
    return null;
  }
}
