import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { Request } from 'express';
import { LocationService } from './location.service';


@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async create(@Body() @Req() req: Request) {
    // Assuming user and geoInfo are available on the request object
    const user = (req as any).user;
    const geoInfo = (req as any).geoInfo;
    if (user && geoInfo) {
      await this.locationService.log(
        user.id,
        geoInfo.ip,
        geoInfo.country,
        geoInfo.region,
        geoInfo.city,
      );
    }
    return this.locationService.create(req.body);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.locationService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }
}
