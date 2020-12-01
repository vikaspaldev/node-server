import { getNetworkInterfaces } from './networkInterface';

export const getLocalHostName = (): string => {
  const networkInterface = getNetworkInterfaces().find(
    i => i.family === 'IPv4' && i.internal,
  );

  if (networkInterface === undefined) {
    throw new Error('No network interface found');
  }

  return networkInterface.address;
};
