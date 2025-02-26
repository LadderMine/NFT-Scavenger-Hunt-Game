import { Body, Controller, Post } from '@nestjs/common';
import { CreateHintDto } from './dto/create-hints.dto';
import { HintsService } from './hints.service';
@Controller('hints')
export class HintsController {
constructor(private readonly hintsService: HintsService) {}

  @Post()
  async createHint(@Body() createHintDto: CreateHintDto) {
    return await this.hintsService.createHint(createHintDto);
  }
}
