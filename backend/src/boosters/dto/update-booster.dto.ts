import { PartialType } from "@nestjs/mapped-types"
import { CreateBoosterDto } from "./create-booster.dto"

export class UpdateBoosterDto extends PartialType(CreateBoosterDto) {}

