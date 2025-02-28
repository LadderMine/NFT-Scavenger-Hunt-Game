import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RankService } from './rank.service';
import { CreateRankDto } from './dto/create-rank.dto';
import { UpdateRankDto } from './dto/update-rank.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('rank')
export class RankController {
  constructor(private readonly rankService: RankService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() createRankDto: CreateRankDto) {
    return this.rankService.create(createRankDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  findAll() {
    return this.rankService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.rankService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateRankDto: UpdateRankDto) {
    return this.rankService.update(+id, updateRankDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.rankService.remove(+id);
  }
}
