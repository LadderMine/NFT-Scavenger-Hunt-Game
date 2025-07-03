import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import type { VerificationService } from "../services/verification.service"
import type { WalletVerificationOptions, WalletTokenPayload } from "../interfaces/token.interface"

export const WALLET_OPTIONS_KEY = "wallet_options"
export const WalletOptions = (options: WalletVerificationOptions) =>
  Reflector.createDecorator<WalletVerificationOptions>({ key: WALLET_OPTIONS_KEY, value: options })

@Injectable()
export class WalletGuard implements CanActivate {
  private readonly logger = new Logger(WalletGuard.name)

  constructor(
    private readonly verificationService: VerificationService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    // Extract wallet token data from request body or headers
    const walletTokenData = this.extractWalletTokenData(request)

    if (!walletTokenData) {
      throw new BadRequestException("Wallet token data is missing")
    }

    // Get wallet options from decorator if present
    const options = this.reflector.getAllAndOverride<WalletVerificationOptions>(WALLET_OPTIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const validationResult = await this.verificationService.validateWalletToken(walletTokenData, options)

    if (!validationResult.isValid) {
      this.logger.warn(`Wallet validation failed: ${validationResult.error}`)
      throw new UnauthorizedException("Invalid wallet signature")
    }

    // Attach the payload to the request for use in controllers
    request.walletPayload = validationResult.payload
    request.tokenExpiresAt = validationResult.expiresAt

    return true
  }

  private extractWalletTokenData(request: any): WalletTokenPayload | null {
    // Try to get from request body first
    if (request.body?.walletToken) {
      return request.body.walletToken
    }

    // Try to get from individual fields in body
    if (request.body?.address && request.body?.signature && request.body?.message) {
      return {
        address: request.body.address,
        signature: request.body.signature,
        message: request.body.message,
        timestamp: request.body.timestamp || Date.now(),
      }
    }

    // Try to get from custom headers
    const address = request.headers["x-wallet-address"]
    const signature = request.headers["x-wallet-signature"]
    const message = request.headers["x-wallet-message"]
    const timestamp = request.headers["x-wallet-timestamp"]

    if (address && signature && message) {
      return {
        address,
        signature,
        message,
        timestamp: timestamp ? Number.parseInt(timestamp) : Date.now(),
      }
    }

    return null
  }
}
