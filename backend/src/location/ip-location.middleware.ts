import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import * as ip2location from 'ip2location-nodejs';

const ip2loc = new ip2location.IP2Location();
ip2loc.open('src/location/IP2LOCATION-LITE.BIN');

@Injectable()
export class IPLocationMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: NextFunction) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress;

    const location = ip2loc.getAll(ip);
    (req as any).geoInfo = {
      ip,
      country: location.countryLong,
      region: location.region,
      city: location.city,
    };

    next();
  }
}
