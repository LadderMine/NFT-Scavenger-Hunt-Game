import { IsArray, IsUUID, ArrayMinSize } from "class-validator"

export class NotificationIdsDto {
  @IsArray()
  @IsUUID(4, { each: true })
  @ArrayMinSize(1)
  ids: string[]
}

