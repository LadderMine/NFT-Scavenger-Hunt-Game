import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationException extends HttpException {
  constructor(message: string) {
    super({ message, error: 'AuthenticationError' }, HttpStatus.UNAUTHORIZED);
  }
}
