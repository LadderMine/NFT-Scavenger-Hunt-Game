import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreatePuzzleDto } from './dtos/createPuzzles.dto';
import { PuzzlesService } from './puzzles.service';


@Controller('puzzles')
export class PuzzlesController {
    constructor(private readonly puzzleService: PuzzlesService) {}

    @Post()
    async create(@Body() createPuzzleDto: CreatePuzzleDto) {
        const errors = await validate(createPuzzleDto)
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        return this.puzzleService.create(createPuzzleDto);
    }
}
