import { Injectable, type NestMiddleware, UnauthorizedException } from "@nestjs/common"
import type { Request, Response, NextFunction } from "express"
import type { JwtService } from "@nestjs/jwt"
import type { ConfigService } from "@nestjs/config"

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)

      try {
        const decoded = this.jwtService.verify(token, {
          secret: this.configService.get("JWT_SECRET"),
        })

        req["user"] = decoded
      } catch (error) {
        throw new UnauthorizedException("Invalid token")
      }
    }

    next()
  }
}
