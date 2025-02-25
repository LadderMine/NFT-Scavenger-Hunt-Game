import { Controller, Patch, Param, Body, NotFoundException } from '@nestjs/common';
import { HintsService } from './hints.service';
import { CreateHintDto } from './dto/create-hints.dto';
import { UpdateHintDto } from './dto/update-hint.dto';

@Controller('hints')
export class HintsController {
    constructor(private readonly hintsService: HintsService) { }

    @Post()
    async createHint(@Body() createHintDto: CreateHintDto) {
      return await this.hintsService.createHint(createHintDto);
    }
  
    @Patch(':id')
    async updateHint(@Param('id') id: string, @Body() updateHintDto: UpdateHintDto) {
        const updatedHint = await this.hintsService.updateHint(id, updateHintDto);
        if (!updatedHint) {
            throw new NotFoundException('Hint not found');
        }
        return updatedHint;
    }
}
