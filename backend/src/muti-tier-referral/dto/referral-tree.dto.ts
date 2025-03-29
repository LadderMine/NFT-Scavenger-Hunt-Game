import { IsUUID, IsNotEmpty, IsOptional, IsInt, Min, Max } from "class-validator"

export class ReferralTreeQueryDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string

  @IsInt()
  @Min(1)
  @Max(3)
  @IsOptional()
  maxDepth?: number = 3
}

export class ReferralTreeNodeDto {
  id: string
  userId: string
  tier: number
  createdAt: Date
  children?: ReferralTreeNodeDto[]
}

export class ReferralTreeResponseDto {
  userId: string
  totalReferrals: number
  tree: ReferralTreeNodeDto
}

