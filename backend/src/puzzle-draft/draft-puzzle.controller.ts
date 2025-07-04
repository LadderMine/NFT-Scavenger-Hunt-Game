import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { DraftPuzzleService } from './draft-puzzle.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';
// Assume AuthGuard is set up to handle roles like admin/contributor
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('drafts')
@UseGuards(AuthGuard, RolesGuard)
export class DraftPuzzleController {
  constructor(private readonly draftService: DraftPuzzleService) {}

  @Post()
  @Roles('admin', 'contributor')
  create(@Body() dto: CreateDraftDto, @Req() req) {
    return this.draftService.create(dto, req.user.id);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.draftService.findAll();
  }

  @Patch(':id')
  @Roles('admin', 'contributor')
  update(@Param('id') id: string, @Body() dto: UpdateDraftDto) {
    return this.draftService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.draftService.remove(id);
  }

  @Post(':id/publish')
  @Roles('admin')
  publish(@Param('id') id: string) {
    return this.draftService.publish(id);
  }
}
