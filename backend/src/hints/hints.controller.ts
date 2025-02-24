import { Controller } from '@nestjs/common';
import { HintsService } from './hints.service';
@Controller('hints')
export class HintsController {
constructor(private readonly hintsService: HintsService) {}

}
