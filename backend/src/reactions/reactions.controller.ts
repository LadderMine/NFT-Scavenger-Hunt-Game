import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { ReactionsService } from './providers/reactions-provider.service';

@Controller('reactions')
export class ReactionsController {
    constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  addReaction(@Body() createReactionDto: CreateReactionDto) {
    return this.reactionsService.addReaction(createReactionDto);
  }

  @Delete(':postId/:userId')
  removeReaction(@Param('postId') postId: number, @Param('userId') userId: number) {
    return this.reactionsService.removeReaction(postId, userId);
  }
}
