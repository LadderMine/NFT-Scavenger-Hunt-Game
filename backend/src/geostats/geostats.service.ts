
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeoStats } from './entities/geostat.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeoStatsService {
  constructor(
    @InjectRepository(GeoStats)
    private readonly geoStatsRepository: Repository<GeoStats>,
    private readonly httpService: HttpService,
  ) {}

  async trackUser(ipAddress: string): Promise<GeoStats> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://ip-api.com/json/${ipAddress}`),
      );

      const newGeoStat = this.geoStatsRepository.create({
        ipAddress,
        country: data.country || 'Unknown',
      });

      return await this.geoStatsRepository.save(newGeoStat);
    } catch (error) {
      console.error('Error resolving IP address:', error);
      
      const newGeoStat = this.geoStatsRepository.create({
        ipAddress,
        country: 'Unknown',
      });
      return await this.geoStatsRepository.save(newGeoStat);
    }
  }

  async getStats(): Promise<{ country: string; userCount: string }[]> {
    return this.geoStatsRepository
      .createQueryBuilder('geostats')
      .select('country')
      .addSelect('COUNT(DISTINCT "ipAddress")', 'userCount')
      .groupBy('country')
      .getRawMany();
  }
}