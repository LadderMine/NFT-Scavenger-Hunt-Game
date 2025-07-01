import { PartialType, OmitType } from "@nestjs/mapped-types"
import { CreateReactionDto } from "./create-reaction.dto"

export class UpdateReactionDto extends PartialType(OmitType(CreateReactionDto, ["userId", "contentId"] as const)) {}
