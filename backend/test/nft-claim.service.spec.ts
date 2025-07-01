import { Test, TestingModule } from '@nestjs/testing';
import { NFTClaimService } from '../src/nft-claim/nft-claim.service';
import { StarkNetHandlerService } from '../src/nft-claim/providers/starknet-handler.service';
import { ClaimNFTDto } from '../src/nft-claim/dto/claim-nft.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('NFTClaimService', () => {
  let service: NFTClaimService;
  let starkNetHandler: StarkNetHandlerService;

  const mockClaimNFTDto: ClaimNFTDto = {
    userId: 'user123',
    nftId: 'nft456',
  };

  const mockStarkNetHandler = {
    claimNFT: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NFTClaimService,
        {
          provide: StarkNetHandlerService,
          useValue: mockStarkNetHandler,
        },
      ],
    }).compile();

    service = module.get<NFTClaimService>(NFTClaimService);
    starkNetHandler = module.get<StarkNetHandlerService>(StarkNetHandlerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('claimNFT', () => {
    it('should successfully claim NFT on first attempt', async () => {
      const mockResult = { status: 'success', transactionId: 'tx789' };
      mockStarkNetHandler.claimNFT.mockResolvedValue(mockResult);

      const result = await service.claimNFT(mockClaimNFTDto);

      expect(result).toEqual(mockResult);
      expect(mockStarkNetHandler.claimNFT).toHaveBeenCalledTimes(1);
      expect(mockStarkNetHandler.claimNFT).toHaveBeenCalledWith(mockClaimNFTDto);
    });

    it('should retry on failure and succeed on subsequent attempt', async () => {
      const mockResult = { status: 'success', transactionId: 'tx789' };
      mockStarkNetHandler.claimNFT
        .mockRejectedValueOnce(new InternalServerErrorException('Network error'))
        .mockResolvedValue(mockResult);

      const result = await service.claimNFT(mockClaimNFTDto);

      expect(result).toEqual(mockResult);
      expect(mockStarkNetHandler.claimNFT).toHaveBeenCalledTimes(2);
      expect(mockStarkNetHandler.claimNFT).toHaveBeenCalledWith(mockClaimNFTDto);
    });

    it('should fail after max retries on persistent error', async () => {
      mockStarkNetHandler.claimNFT.mockRejectedValue(new InternalServerErrorException('Network error'));

      await expect(service.claimNFT(mockClaimNFTDto)).rejects.toThrow(InternalServerErrorException);
      expect(mockStarkNetHandler.claimNFT).toHaveBeenCalledTimes(3);
      expect(mockStarkNetHandler.claimNFT).toHaveBeenCalledWith(mockClaimNFTDto);
    });

    it('should throw BadRequestException immediately without retries', async () => {
      mockStarkNetHandler.claimNFT.mockRejectedValue(new BadRequestException('Invalid parameters'));

      await expect(service.claimNFT(mockClaimNFTDto)).rejects.toThrow(BadRequestException);
      expect(mockStarkNetHandler.claimNFT).toHaveBeenCalledTimes(1);
      expect(mockStarkNetHandler.claimNFT).toHaveBeenCalledWith(mockClaimNFTDto);
    });
  });
}); 