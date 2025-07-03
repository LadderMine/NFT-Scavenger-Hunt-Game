import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  itemName: string;
  pointsSpent: number;
  purchaseDate: Date;
}

@Injectable()
export class RewardShopService {
  private readonly logger = new Logger(RewardShopService.name);

  private shopItems = new Map<string, ShopItem>();

  private purchases = new Map<string, Purchase>();

  private userPoints = new Map<string, number>();

  constructor() {
    this.seedData();
  }

  private seedData(): void {
    this.logger.log('Seeding initial reward shop data...');
    const items: ShopItem[] = [
      {
        id: 'item1',
        name: 'Bronze Chest',
        description: 'Contains common rewards.',
        price: 100,
        category: 'Chest',
        stock: 50,
        imageUrl: 'https://placehold.co/100x100/FFD700/000000?text=Chest',
      },
      {
        id: 'item2',
        name: 'Silver Key',
        description: 'Unlocks silver chests.',
        price: 50,
        category: 'Key',
        stock: 100,
        imageUrl: 'https://placehold.co/100x100/C0C0C0/000000?text=Key',
      },
      {
        id: 'item3',
        name: 'Gold Coin Pack',
        description: '1000 virtual coins.',
        price: 250,
        category: 'Currency',
        stock: 20,
        imageUrl: 'https://placehold.co/100x100/FFD700/000000?text=Coin',
      },
      {
        id: 'item4',
        name: 'XP Boost (1hr)',
        description: 'Boosts experience gain for 1 hour.',
        price: 75,
        category: 'Boost',
        stock: 75,
        imageUrl: 'https://placehold.co/100x100/8A2BE2/FFFFFF?text=Boost',
      },
      {
        id: 'item5',
        name: 'Rare Skin Crate',
        description: 'Unlock a rare character skin.',
        price: 500,
        category: 'Crate',
        stock: 10,
        imageUrl: 'https://placehold.co/100x100/FF4500/FFFFFF?text=Skin',
      },
      {
        id: 'item6',
        name: 'Health Potion',
        description: 'Restores health in game.',
        price: 20,
        category: 'Consumable',
        stock: 200,
        imageUrl: 'https://placehold.co/100x100/DC143C/FFFFFF?text=Potion',
      },
    ];

    items.forEach((item) => this.shopItems.set(item.id, item));

    this.userPoints.set('userA', 1000);
    this.userPoints.set('userB', 300);
    this.userPoints.set('userC', 50);

    this.logger.log(`Seeded ${this.shopItems.size} shop items.`);
    this.logger.log(`Seeded ${this.userPoints.size} user point balances.`);
  }

  listAvailableItems(
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    availableOnly: boolean = false,
  ): ShopItem[] {
    this.logger.log(
      `Listing items with filters: category=${category}, minPrice=${minPrice}, maxPrice=${maxPrice}, availableOnly=${availableOnly}`,
    );
    let filteredItems = Array.from(this.shopItems.values());

    if (category) {
      filteredItems = filteredItems.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase(),
      );
    }
    if (minPrice !== undefined) {
      filteredItems = filteredItems.filter((item) => item.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filteredItems = filteredItems.filter((item) => item.price <= maxPrice);
    }
    if (availableOnly) {
      filteredItems = filteredItems.filter((item) => item.stock > 0);
    }

    return filteredItems;
  }

  getItemById(itemId: string): ShopItem {
    this.logger.log(`Fetching item by ID: ${itemId}`);
    const item = this.shopItems.get(itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID "${itemId}" not found.`);
    }
    return item;
  }

  purchaseItem(userId: string, itemId: string): Purchase {
    this.logger.log(`Attempting purchase: User ${userId}, Item ${itemId}`);

    const item = this.shopItems.get(itemId);
    if (!item) {
      this.logger.warn(`Purchase failed: Item ${itemId} not found.`);
      throw new NotFoundException(`Item with ID "${itemId}" not found.`);
    }

    if (item.stock <= 0) {
      this.logger.warn(`Purchase failed: Item ${itemId} is out of stock.`);
      throw new BadRequestException(`Item "${item.name}" is out of stock.`);
    }

    const userCurrentPoints = this.userPoints.get(userId) || 0;
    if (userCurrentPoints < item.price) {
      this.logger.warn(
        `Purchase failed: User ${userId} has insufficient points (${userCurrentPoints}) for item ${itemId} (price ${item.price}).`,
      );
      throw new BadRequestException(
        `Insufficient points. You need ${item.price} points, but you only have ${userCurrentPoints}.`,
      );
    }

    item.stock--;
    this.userPoints.set(userId, userCurrentPoints - item.price);
    this.shopItems.set(item.id, item);

    const purchaseId = `purchase-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newPurchase: Purchase = {
      id: purchaseId,
      userId,
      itemId,
      itemName: item.name,
      pointsSpent: item.price,
      purchaseDate: new Date(),
    };
    this.purchases.set(purchaseId, newPurchase);

    this.logger.log(
      `Purchase successful: User ${userId} bought ${item.name} for ${item.price} points.`,
    );
    this.logger.log(`Remaining stock for ${item.name}: ${item.stock}`);
    this.logger.log(
      `User ${userId} new point balance: ${this.userPoints.get(userId)}`,
    );

    return newPurchase;
  }

  getUserPoints(userId: string): number {
    return this.userPoints.get(userId) || 0;
  }

  addPointsToUser(userId: string, amount: number): void {
    const currentPoints = this.userPoints.get(userId) || 0;
    this.userPoints.set(userId, currentPoints + amount);
    this.logger.log(
      `Added ${amount} points to user ${userId}. New balance: ${this.userPoints.get(userId)}`,
    );
  }
}
