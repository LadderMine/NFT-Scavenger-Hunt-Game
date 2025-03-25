import { IsNotEmpty, IsUUID } from "class-validator"

export class PurchaseBundleDto {
  @IsUUID()
  @IsNotEmpty()
  bundleId: string
}

