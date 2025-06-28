import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInventoryController } from './user-inventory.controller';
import { UserInventoryService } from './user-inventory.service';
import { Inventory } from './entities/inventory';
import { User } from './entities/user';
import { NFT } from './entities/nft';
import { Badge } from './entities/badge';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, User, NFT, Badge]),
  ],
  controllers: [UserInventoryController],
  providers: [UserInventoryService],
  exports: [UserInventoryService], // Export for use in other modules
})
export class UserInventoryModule {}