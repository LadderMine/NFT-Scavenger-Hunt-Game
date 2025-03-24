import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { StripeLogger } from './stripe.logger';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StripeTransaction } from './stripe.entity';
import { Repository } from 'typeorm';

describe('StripeService', () => {
  let service: StripeService;
  let logger: StripeLogger;
  let transactionRepository: Repository<StripeTransaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        StripeLogger,
        {
          provide: getRepositoryToken(StripeTransaction),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
    logger = module.get<StripeLogger>(StripeLogger);
    transactionRepository = module.get<Repository<StripeTransaction>>(getRepositoryToken(StripeTransaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payment intent', async () => {
    const amount = 1000;
    const currency = 'usd';
    jest.spyOn(service, 'createPaymentIntent').mockImplementation(async () => ({ clientSecret: 'test_secret' }));

    const result = await service.createPaymentIntent(amount, currency);
    expect(result.clientSecret).toBe('test_secret');
  });
});
