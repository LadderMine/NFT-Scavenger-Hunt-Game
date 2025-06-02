import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from '../location.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from '../entities/location.entity';
import { Repository } from 'typeorm';

describe('LocationService', () => {
  let service: LocationService;
  let repo: Repository<Location>;

  const mockLocationRepo = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((location) => Promise.resolve({ id: 1, ...location })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepo,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    repo = module.get(getRepositoryToken(Location));
  });

  it('should log a location', async () => {
    const result = await service.log(42, '8.8.8.8', 'USA', 'California', 'Mountain View');
    expect(result).toEqual({
      id: 1,
      userId: 42,
      ip: '8.8.8.8',
      country: 'USA',
      region: 'California',
      city: 'Mountain View',
    });
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });
});
