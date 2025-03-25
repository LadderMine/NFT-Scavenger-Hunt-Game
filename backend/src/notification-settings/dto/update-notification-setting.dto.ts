import { PartialType } from '@nestjs/swagger';
import { CreateNotificationSettingDto } from './create-notification-setting.dto';

export class UpdateNotificationSettingDto extends PartialType(CreateNotificationSettingDto) {}
