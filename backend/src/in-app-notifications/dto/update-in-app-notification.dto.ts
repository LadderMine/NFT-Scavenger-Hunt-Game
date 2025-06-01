import { PartialType } from '@nestjs/swagger';
import { CreateInAppNotificationDto } from './create-in-app-notification.dto';

export class UpdateInAppNotificationDto extends PartialType(CreateInAppNotificationDto) {}
