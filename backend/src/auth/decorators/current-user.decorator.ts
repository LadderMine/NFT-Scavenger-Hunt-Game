import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import type { User } from "../entities/user.entity"

export const CurrentUser = createParamDecorator((data: keyof User | undefined, ctx: ExecutionContext): User | any => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user

  return data ? user?.[data] : user
})
