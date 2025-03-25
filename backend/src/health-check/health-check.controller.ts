import { Controller, Get, } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';

@Controller('health-check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  
  @Get()
  async checkHealth() {
   const healthCheck = await this.healthCheckService.checkHealth();
   return{
    uptime:this.healthCheckService.getUptime(),...healthCheck
   }
  }
  @Get('system-usage')
  async getSystemUsage() {
    const systemUsage = await this.healthCheckService.getSystemUsage();
    return {
      systemUsage,
    };
  }
  }


  
