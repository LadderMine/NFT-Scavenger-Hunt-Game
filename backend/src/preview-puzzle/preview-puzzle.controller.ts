import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreviewPuzzleService } from './preview-puzzle.service';
import { StartPreviewDto, SubmitAnswerDto } from './dto/start-preview.dto';

@Controller('preview-puzzle')
export class PreviewPuzzleController {
  constructor(private readonly previewPuzzleService: PreviewPuzzleService) {}

  @Post('start')
  startPreview(@Body() dto: StartPreviewDto) {
  return this.previewPuzzleService.startPreview(dto);
}


  @Get(':sessionId/hint')
  getHint(@Param('sessionId') id: string) {
  return this.previewPuzzleService.getNextHint(id);
}

  @Post(':sessionId/submit')
  submitAnswer(@Param('sessionId') id: string, @Body() dto: SubmitAnswerDto) {
  return this.previewPuzzleService.submitAnswer(id, dto);
}

}
