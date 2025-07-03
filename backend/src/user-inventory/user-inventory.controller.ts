
import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserInventoryService } from './user-inventory.service';
import { UserInventoryResponseDto, InventoryItemDto } from './dto/inventory-response';
import { AddInventoryItemDto } from './dto/add-inventory-item';
import { Auth } from '../auth/decorators/auth-decorator';
import { AuthType } from '../auth/enums/auth-type.enum';

@ApiTags('User Inventory')
@ApiBearerAuth()
@Controller('users/:userId/inventory')
export class UserInventoryController {
  constructor(private readonly userInventoryService: UserInventoryService) {}

  @Auth(AuthType.Bearer) // Assuming you have JWT auth
  @Get()
  @ApiOperation({ summary: 'Get user complete digital inventory' })
  @ApiResponse({ status: 200, description: 'User inventory retrieved successfully', type: UserInventoryResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserInventory(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserInventoryResponseDto> {
    return this.userInventoryService.getUserInventory(userId);
  }

  @Auth(AuthType.Bearer)
  @Get('nfts')
  @ApiOperation({ summary: 'Get user NFTs only' })
  @ApiResponse({ status: 200, description: 'User NFTs retrieved successfully', type: [InventoryItemDto] })
  async getUserNFTs(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<InventoryItemDto[]> {
    return this.userInventoryService.getUserNFTs(userId);
  }

  @Auth(AuthType.Bearer)
  @Get('badges')
  @ApiOperation({ summary: 'Get user badges only' })
  @ApiResponse({ status: 200, description: 'User badges retrieved successfully', type: [InventoryItemDto] })
  async getUserBadges(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<InventoryItemDto[]> {
    return this.userInventoryService.getUserBadges(userId);
  }

  @Auth(AuthType.Bearer)
  @Get('items/:itemId')
  @ApiOperation({ summary: 'Get individual asset details' })
  @ApiResponse({ status: 200, description: 'Inventory item details retrieved successfully', type: InventoryItemDto })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  async getInventoryItemDetails(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<InventoryItemDto> {
    return this.userInventoryService.getInventoryItemDetails(userId, itemId);
  }

  @Auth(AuthType.Bearer)
  @Post('items')
  @ApiOperation({ summary: 'Add item to user inventory' })
  @ApiResponse({ status: 201, description: 'Item added to inventory successfully', type: InventoryItemDto })
  @ApiResponse({ status: 404, description: 'User or asset not found' })
  @ApiResponse({ status: 409, description: 'User already owns this item' })
  async addInventoryItem(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() addItemDto: AddInventoryItemDto,
  ): Promise<InventoryItemDto> {
    // Ensure the userId in the URL matches the DTO
    addItemDto.userId = userId;
    return this.userInventoryService.addInventoryItem(addItemDto);
  }
}