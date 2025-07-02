import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

describe('WalletController', () => {
  let controller: WalletController;
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: WalletService,
          useValue: {
            linkWallet: jest.fn().mockResolvedValue({ address: '0x123' }),
            verifySignature: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should link wallet', async () => {
    const result = await controller.linkWallet({ address: '0x123' });
    expect(result.address).toBe('0x123');
  });

  it('should verify signature (POST)', async () => {
    const result = await controller.verifySignature({ address: '0x123', signature: 'sig', message: 'msg' });
    expect(result.valid).toBe(true);
  });

  it('should verify signature (GET)', async () => {
    const result = await controller.verifySignatureGet('0x123', 'sig', 'msg');
    expect(result.valid).toBe(true);
  });
});
