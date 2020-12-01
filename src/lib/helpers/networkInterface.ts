import { NetworkInterfaceInfo, networkInterfaces } from 'os';

export const getNetworkInterfaces = (): NetworkInterfaceInfo[] => {
  const networkReducer = (
    acc: NetworkInterfaceInfo[],
    [, value]: [string, NetworkInterfaceInfo[] | undefined],
  ) => [...acc, ...(value !== undefined ? value : [])];

  const networkInterfaceInfo = networkInterfaces();
  return Object.entries(networkInterfaceInfo).reduce<NetworkInterfaceInfo[]>(
    networkReducer,
    [],
  );
};
