import { AddressInfo } from 'net';

export const normalizeServerAddress = (
  addressInfo: string | AddressInfo | null,
): string => {
  if (!addressInfo) {
    throw new Error('Empty server address');
  }
  return typeof addressInfo === 'string'
    ? addressInfo
    : `http://${addressInfo.address}:${addressInfo.port}`;
};
