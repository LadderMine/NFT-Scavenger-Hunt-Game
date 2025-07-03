import { PartialType } from '@nestjs/swagger';
import { CreateUserInventoryDto } from './create-user-inventory.dto';

export class UpdateUserInventoryDto extends PartialType(CreateUserInventoryDto) {}
