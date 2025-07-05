import { Injectable } from '@nestjs/common';
import { NftItem } from './entities/nft-item.entity';

@Injectable()
export class NftMarketplaceStubService {
  private readonly mockNfts: NftItem[] = [
    {
      id: '1',
      name: 'Cyber Lion',
      imageUrl: 'https://example.com/images/cyber_lion.png',
      price: 1.5,
      description: 'A majestic lion from the digital savanna, roaring on the blockchain.',
      owner: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', // Vitalik Buterin's address
    },
    {
      id: '2',
      name: 'Pixel Explorer',
      imageUrl: 'https://example.com/images/pixel_explorer.png',
      price: 0.8,
      description: 'A brave explorer venturing into the 8-bit unknown. Limited edition.',
      owner: '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6',
    },
    {
      id: '3',
      name: 'Astro Cat',
      imageUrl: 'https://example.com/images/astro_cat.png',
      price: 2.2,
      description: 'This feline has seen things you wouldn’t believe among the stars.',
      owner: '0x5095d437343461A4733122143B17978288019C34',
    },
     {
      id: '4',
      name: 'Glitch Mona Lisa',
      imageUrl: 'https://example.com/images/glitch_mona.png',
      price: 10.1,
      description: 'A classic reborn in the digital age, beautifully broken.',
      owner: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    },
  ];

 
  findAll(): NftItem[] {
    return this.mockNfts;
  }
}