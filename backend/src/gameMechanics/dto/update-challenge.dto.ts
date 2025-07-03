import { PartialType } from "@nestjs/mapped-types"
import { CreateChallengeDto } from "./create-challenge.dto"

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {}
