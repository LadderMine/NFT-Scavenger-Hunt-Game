import { IPLocationMiddleware } from '../ip-location.middleware';
import * as ip2location from 'ip2location-nodejs';

jest.mock('ip2location-nodejs', () => ({
  IP2Location_init: jest.fn(),
  IP2Location_get_all: jest.fn().mockReturnValue({
    country_long: 'United States',
    region: 'California',
    city: 'Mountain View',
  }),
}));

describe('IPLocationMiddleware', () => {
  let middleware: IPLocationMiddleware;

  beforeEach(() => {
    middleware = new IPLocationMiddleware();
  });

  it('should attach geoInfo to request', () => {
    const req: any = {
      headers: { 'x-forwarded-for': '8.8.8.8' },
      socket: { remoteAddress: '127.0.0.1' },
    };
    const res = {};
    const next = jest.fn();

    middleware.use(req as any, res as any, next);

    expect(req.geoInfo).toEqual({
      ip: '8.8.8.8',
      country: 'United States',
      region: 'California',
      city: 'Mountain View',
    });
    expect(next).toHaveBeenCalled();
  });
});
