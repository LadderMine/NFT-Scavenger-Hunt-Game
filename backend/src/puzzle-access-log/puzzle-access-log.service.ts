
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, Between } from 'typeorm';
import { PuzzleAccessLog } from './entities/puzzle-access-log.entity';
import { LogAccessDto } from './dto/log-access.dto';

@Injectable()
export class PuzzleAccessLogService {
  constructor(
    @InjectRepository(PuzzleAccessLog)
    private readonly accessLogRepository: Repository<PuzzleAccessLog>,
  ) {}

  async logAccess(dto: LogAccessDto): Promise<PuzzleAccessLog> {
    const newLog = this.accessLogRepository.create(dto);
    return this.accessLogRepository.save(newLog);
  }

  

  async getMostAccessedPuzzles(): Promise<{ puzzleId: string; accessCount: string }[]> {
    return this.accessLogRepository
      .createQueryBuilder('log')
      .select('log.puzzleId', 'puzzleId')
      .addSelect('COUNT(log.id)', 'accessCount')
      .groupBy('log.puzzleId')
      .orderBy('accessCount', 'DESC')
      .limit(10) 
      .getRawMany();
  }

  async getUniqueUsersPerPuzzle(puzzleId: string): Promise<{ uniqueUserCount: number }> {
    const count = await this.accessLogRepository
      .createQueryBuilder('log')
      .select('COUNT(DISTINCT log.userId)', 'count')
      .where('log.puzzleId = :puzzleId', { puzzleId })
      .getRawOne();
      
    return { uniqueUserCount: parseInt(count.count, 10) || 0 };
  }
  
  async getTimeBasedTrends(days: number = 7): Promise<{ date: string; accessCount: string }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.accessLogRepository
      .createQueryBuilder('log')
      .select("DATE(log.accessTimestamp)", "date")
      .addSelect("COUNT(log.id)", "accessCount")
      .where("log.accessTimestamp >= :startDate", { startDate })
      .groupBy("DATE(log.accessTimestamp)")
      .orderBy("date", "ASC")
      .getRawMany();
  }
}