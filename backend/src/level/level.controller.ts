import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth-decorator';
import { AuthType } from '../auth/enums/auth-type.enum';

@ApiTags('Levels')
@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post()
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Create a new level' })
  @ApiResponse({ status: 201, description: 'Level successfully created.' })
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }

  @Get()
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Get all levels' })
  @ApiResponse({ status: 200, description: 'Return all levels.' })
  findAll() {
    return this.levelService.findAll();
  }

  @Get(':id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Get a level by id' })
  @ApiResponse({ status: 200, description: 'Return the level.' })
  @ApiResponse({ status: 404, description: 'Level not found.' })
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(+id);
  }

  @Patch(':id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Update a level' })
  @ApiResponse({ status: 200, description: 'Level successfully updated.' })
  update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelService.update(+id, updateLevelDto);
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Delete a level' })
  @ApiResponse({ status: 200, description: 'Level successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.levelService.remove(+id);
  }
}