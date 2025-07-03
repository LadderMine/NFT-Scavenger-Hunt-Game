import { HttpException, HttpStatus } from "@nestjs/common"

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super("Invalid email or password", HttpStatus.UNAUTHORIZED)
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super("User with this email already exists", HttpStatus.CONFLICT)
  }
}

export class AccountDeactivatedException extends HttpException {
  constructor() {
    super("Account has been deactivated", HttpStatus.UNAUTHORIZED)
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    super("Token has expired", HttpStatus.UNAUTHORIZED)
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super("Invalid token provided", HttpStatus.UNAUTHORIZED)
  }
}
