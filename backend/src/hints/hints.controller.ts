import { Controller, Patch, Param, Body, NotFoundException } from '@nestjs/common';
import { HintsService } from './hints.service';
import { UpdateHintDto } from './dto/update-hint.dto';

@Controller('hints')
export class HintsController {
    constructor(private readonly hintsService: HintsService) { }

    @Patch(':id')
    async updateHint(@Param('id') id: string, @Body() updateHintDto: UpdateHintDto) {
        const updatedHint = await this.hintsService.updateHint(id, updateHintDto);
        if (!updatedHint) {
            throw new NotFoundException('Hint not found');
        }
        return updatedHint;
    }
}
