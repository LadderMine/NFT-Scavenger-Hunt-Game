import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RewardShopService, ShopItem, Purchase } from './reward-shop.service';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class GetItemsFilterDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  availableOnly?: boolean;
}

class PurchaseItemDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  itemId: string;
}

@Controller('reward-shop')
export class RewardShopController {
  private readonly logger = new Logger(RewardShopController.name);

  constructor(private readonly rewardShopService: RewardShopService) {}

  @Get('items')
  listItems(@Query() filterDto: GetItemsFilterDto): ShopItem[] {
    this.logger.log(
      `Received request to list items with filters: ${JSON.stringify(filterDto)}`,
    );
    return this.rewardShopService.listAvailableItems(
      filterDto.category,
      filterDto.minPrice,
      filterDto.maxPrice,
      filterDto.availableOnly,
    );
  }

  @Get('items/:itemId')
  getItemById(@Param('itemId') itemId: string): ShopItem {
    this.logger.log(`Received request for item by ID: ${itemId}`);
    return this.rewardShopService.getItemById(itemId);
  }

  @Post('purchase')
  @HttpCode(HttpStatus.CREATED)
  purchaseItem(@Body() purchaseDto: PurchaseItemDto): Purchase {
    this.logger.log(
      `Received purchase request: ${JSON.stringify(purchaseDto)}`,
    );
    const { userId, itemId } = purchaseDto;
    return this.rewardShopService.purchaseItem(userId, itemId);
  }

  @Get('users/:userId/points')
  getUserPoints(@Param('userId') userId: string): {
    userId: string;
    points: number;
  } {
    this.logger.log(`Received request for user ${userId} points.`);
    const points = this.rewardShopService.getUserPoints(userId);
    return { userId, points };
  }

  @Post('users/:userId/add-points')
  @HttpCode(HttpStatus.NO_CONTENT)
  addPoints(
    @Param('userId') userId: string,
    @Body('amount') amount: number,
  ): void {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new BadRequestException('Amount must be a positive number.');
    }
    this.logger.log(
      `Received request to add ${amount} points to user ${userId}.`,
    );
    this.rewardShopService.addPointsToUser(userId, amount);
  }
}
