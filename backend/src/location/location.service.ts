import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity'; 
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  create(createLocationDto: CreateLocationDto) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: number) {
    throw new Error('Method not implemented.');
  }
  update(arg0: number, updateLocationDto: UpdateLocationDto) {
    throw new Error('Method not implemented.');
  }
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
  ) {}

  async log(userId: number, ip: string, country: string, region: string, city: string) {
    const location = this.locationRepo.create({ userId, ip, country, region, city });
    return this.locationRepo.save(location);
  }
}
