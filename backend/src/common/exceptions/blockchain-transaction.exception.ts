import { HttpException, HttpStatus } from '@nestjs/common';

export class BlockchainTransactionException extends HttpException {
  constructor(message: string) {
    super(
      { message, error: 'BlockchainTransactionError' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
