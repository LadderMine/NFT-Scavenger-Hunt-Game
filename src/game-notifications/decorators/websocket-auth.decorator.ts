import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import type { Socket } from "socket.io"

export const WsUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const client: Socket = ctx.switchToWs().getClient()
  return client.handshake.auth?.user || client.handshake.query?.userId
})
