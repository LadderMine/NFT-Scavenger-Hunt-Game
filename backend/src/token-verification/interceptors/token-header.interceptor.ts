import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common"
import type { Observable } from "rxjs"
import { map } from "rxjs/operators"

@Injectable()
export class TokenHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse()
    const request = context.switchToHttp().getRequest()

    return next.handle().pipe(
      map((data) => {
        // Add token-related headers to response
        if (request.tokenExpiresAt) {
          response.setHeader("X-Token-Expires-At", request.tokenExpiresAt.toISOString())
        }

        if (request.tokenPayload?.sub) {
          response.setHeader("X-Token-Subject", request.tokenPayload.sub)
        }

        if (request.walletPayload?.address) {
          response.setHeader("X-Wallet-Address", request.walletPayload.address)
        }

        return data
      }),
    )
  }
}
