import { IsUUID } from "class-validator"

export class RequestHintDto {
  @IsUUID()
  challengeId: string
}
