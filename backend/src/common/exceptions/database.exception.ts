import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseException extends HttpException {
  constructor(message: string) {
    super({ message, error: 'DatabaseError' }, HttpStatus.BAD_REQUEST);
  }
}
