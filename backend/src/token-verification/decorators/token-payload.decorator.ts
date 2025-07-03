import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import type { JwtPayload, WalletTokenPayload } from "../interfaces/token.interface"

export const TokenPayload = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
  const request = ctx.switchToHttp().getRequest()
  return request.tokenPayload
})

export const WalletPayload = createParamDecorator((data: unknown, ctx: ExecutionContext): WalletTokenPayload => {
  const request = ctx.switchToHttp().getRequest()
  return request.walletPayload
})
