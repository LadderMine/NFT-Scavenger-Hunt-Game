/* eslint-disable prettier/prettier */
import { CommandFactory } from 'nest-commander';
import { ErrorLoggingModule } from './error-logging/error-logging.module';

async function bootstrap() {
  await CommandFactory.run(ErrorLoggingModule, {
    logger: ['error', 'warn'],
  });
}

bootstrap(); 