import { getLocalHostName } from '../hostname';
import * as S from '../networkInterface';

const getNetworkInterfaces = jest.spyOn(S, 'getNetworkInterfaces');

describe('hostname', () => {
  it('should return local hostname from os network interfaces', () => {
    expect.assertions(1);

    getNetworkInterfaces.mockReturnValueOnce([
      {
        family: 'IPv4',
        internal: false,
        address: 'dummy-external-address',
        mac: 'dummy-external-mac',
        netmask: 'dummy-external-netmask',
        cidr: null,
      },
      {
        family: 'IPv4',
        internal: true,
        address: 'dummy-internal-address',
        mac: 'dummy-internal-mac',
        netmask: 'dummy-internal-netmask',
        cidr: null,
      },
      {
        family: 'IPv6',
        scopeid: 23,
        internal: true,
        address: 'dummy-ipv6-address',
        mac: 'dummy-ipv6-mac',
        netmask: 'dummy-ipv6-netmask',
        cidr: null,
      },
    ]);
    const hostname = getLocalHostName();
    expect(hostname).toBe(`dummy-internal-address`);
  });
});
