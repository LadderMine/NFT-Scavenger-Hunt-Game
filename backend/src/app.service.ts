import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'NFT Scavenger Hunt API is running.';
  }
}
