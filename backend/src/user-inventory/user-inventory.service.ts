import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory, AssetType } from './entities/inventory';
import { User } from './entities/user';
import { NFT } from './entities/nft';
import { Badge } from './entities/badge';
import { UserInventoryResponseDto, InventoryItemDto, AssetDetailDto } from './dto/inventory-response';
import { AddInventoryItemDto } from './dto/add-inventory-item';

@Injectable()
export class UserInventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(NFT)
    private nftRepository: Repository<NFT>,
    @InjectRepository(Badge)
    private badgeRepository: Repository<Badge>,
  ) {}

  async getUserInventory(userId: string): Promise<UserInventoryResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const inventoryItems = await this.inventoryRepository.find({
      where: { userId },
      order: { acquiredAt: 'DESC' },
    });

    const enrichedInventory = await Promise.all(
      inventoryItems.map(async (item) => {
        const assetDetails = await this.getAssetDetails(item.assetId, item.assetType);
        return this.mapToInventoryItemDto(item, assetDetails);
      }),
    );

    const nftCount = enrichedInventory.filter(item => item.assetType === AssetType.NFT).length;
    const badgeCount = enrichedInventory.filter(item => item.assetType === AssetType.BADGE).length;

    return {
      userId: user.id,
      username: user.username,
      inventory: enrichedInventory,
      totalItems: enrichedInventory.length,
      nftCount,
      badgeCount,
    };
  }

  async getInventoryItemDetails(userId: string, inventoryItemId: string): Promise<InventoryItemDto> {
    const inventoryItem = await this.inventoryRepository.findOne({
      where: { id: inventoryItemId, userId },
    });

    if (!inventoryItem) {
      throw new NotFoundException('Inventory item not found');
    }

    const assetDetails = await this.getAssetDetails(inventoryItem.assetId, inventoryItem.assetType);
    return this.mapToInventoryItemDto(inventoryItem, assetDetails);
  }

  async addInventoryItem(addItemDto: AddInventoryItemDto): Promise<InventoryItemDto> {
    const { userId, assetId, assetType, acquisitionContext } = addItemDto;

    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify asset exists
    const assetExists = await this.verifyAssetExists(assetId, assetType);
    if (!assetExists) {
      throw new NotFoundException(`${assetType} not found`);
    }

    // Check if user already owns this item
    const existingItem = await this.inventoryRepository.findOne({
      where: { userId, assetId, assetType },
    });

    if (existingItem) {
      throw new ConflictException('User already owns this item');
    }

    // Create new inventory item
    const inventoryItem = this.inventoryRepository.create({
      userId,
      assetId,
      assetType,
      acquisitionContext,
    });

    const savedItem = await this.inventoryRepository.save(inventoryItem);
    const assetDetails = await this.getAssetDetails(assetId, assetType);

    return this.mapToInventoryItemDto(savedItem, assetDetails);
  }

  async getUserNFTs(userId: string): Promise<InventoryItemDto[]> {
    const nftItems = await this.inventoryRepository.find({
      where: { userId, assetType: AssetType.NFT },
      order: { acquiredAt: 'DESC' },
    });

    return Promise.all(
      nftItems.map(async (item) => {
        const assetDetails = await this.getAssetDetails(item.assetId, item.assetType);
        return this.mapToInventoryItemDto(item, assetDetails);
      }),
    );
  }

  async getUserBadges(userId: string): Promise<InventoryItemDto[]> {
    const badgeItems = await this.inventoryRepository.find({
      where: { userId, assetType: AssetType.BADGE },
      order: { acquiredAt: 'DESC' },
    });

    return Promise.all(
      badgeItems.map(async (item) => {
        const assetDetails = await this.getAssetDetails(item.assetId, item.assetType);
        return this.mapToInventoryItemDto(item, assetDetails);
      }),
    );
  }

  private async getAssetDetails(assetId: string, assetType: AssetType): Promise<AssetDetailDto> {
    if (assetType === AssetType.NFT) {
      const nft = await this.nftRepository.findOne({ where: { id: assetId } });
      if (!nft) throw new NotFoundException('NFT not found');
      
      return {
        id: nft.id,
        name: nft.name,
        description: nft.description,
        imageUrl: nft.imageUrl,
        rarity: nft.rarity,
        metadata: nft.metadata,
      };
    } else {
      const badge = await this.badgeRepository.findOne({ where: { id: assetId } });
      if (!badge) throw new NotFoundException('Badge not found');
      
      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        iconUrl: badge.iconUrl,
        achievementType: badge.achievementType,
      };
    }
  }

  private async verifyAssetExists(assetId: string, assetType: AssetType): Promise<boolean> {
    if (assetType === AssetType.NFT) {
      const nft = await this.nftRepository.findOne({ where: { id: assetId } });
      return !!nft;
    } else {
      const badge = await this.badgeRepository.findOne({ where: { id: assetId } });
      return !!badge;
    }
  }

  private mapToInventoryItemDto(inventory: Inventory, assetDetails: AssetDetailDto): InventoryItemDto {
    return {
      id: inventory.id,
      assetType: inventory.assetType,
      acquiredAt: inventory.acquiredAt,
      acquisitionContext: inventory.acquisitionContext,
      assetDetails,
    };
  }
}
