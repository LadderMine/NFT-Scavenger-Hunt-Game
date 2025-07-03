import { PartialType } from '@nestjs/swagger';
import { CreateRewardShopDto } from './create-reward-shop.dto';

export class UpdateRewardShopDto extends PartialType(CreateRewardShopDto) {}
