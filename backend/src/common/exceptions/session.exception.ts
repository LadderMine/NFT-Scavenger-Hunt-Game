import { HttpException, HttpStatus } from '@nestjs/common';

export class SessionException extends HttpException {
  constructor(message: string) {
    super({ message, error: 'SessionError' }, HttpStatus.UNAUTHORIZED);
  }
}
