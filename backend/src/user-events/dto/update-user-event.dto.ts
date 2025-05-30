import { PartialType } from '@nestjs/swagger';
import { CreateUserEventDto } from './create-user-event.dto';

export class UpdateUserEventDto extends PartialType(CreateUserEventDto) {}
