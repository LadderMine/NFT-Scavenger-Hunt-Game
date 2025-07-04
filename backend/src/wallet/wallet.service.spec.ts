import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';

describe('WalletService', () => {
  let service: WalletService;
  let repo: Repository<Wallet>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    repo = module.get<Repository<Wallet>>(getRepositoryToken(Wallet));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should link a wallet', async () => {
    const address = '0x123';
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null as any);
    jest.spyOn(repo, 'create').mockReturnValueOnce({ address } as any);
    jest.spyOn(repo, 'save').mockResolvedValueOnce({ address } as any);
    const wallet = await service.linkWallet(address);
    expect(wallet.address).toBe(address);
  });

  it('should verify signature (mocked)', async () => {
    const valid = await service.verifySignature('0x123', 'sig', 'msg');
    expect(valid).toBe(true);
  });
});
