import { HttpException, HttpStatus } from '@nestjs/common';

export class ChainValidationException extends HttpException {
  constructor(message: string) {
    super({ message, error: 'ChainValidationError' }, HttpStatus.BAD_REQUEST);
  }
}
