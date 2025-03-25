import { Injectable } from '@nestjs/common';
import { CreateHealthCheckDto } from './dto/create-health-check.dto';
import { UpdateHealthCheckDto } from './dto/update-health-check.dto';

  
  import { HealthCheck, HealthCheckService as TerminusHealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
  import * as os from 'os';
  
  @Injectable()
  export class HealthCheckService {
    constructor(
      private healthCheckService: TerminusHealthCheckService,
      private http: HttpHealthIndicator,
      private db: TypeOrmHealthIndicator, 
    ) {}
  
    @HealthCheck()
    async checkHealth() {
      return this.healthCheckService.check([
        async () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
        async () => this.db.pingCheck('database'),
      ]);
    }
  
    getUptime() {
      return process.uptime();
    }
  
    getSystemUsage() {
      return {
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        cpuUsage: os.loadavg(),
      };
    }
    }
  
    

