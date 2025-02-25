import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { UserProgressService } from "./user-progress.service";
import { UserProgressDto } from "./dto/user-progress.dto";

@Controller("user-progress")
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Get(":userId")
  async getUserProgress(@Param("userId", ParseIntPipe) userId: number) {
    return this.userProgressService.getUserProgress(userId);
  }

  @Post("update")
  async updateProgress(@Body() userProgressDto: UserProgressDto) {
    return this.userProgressService.updateProgress(userProgressDto);
  }

  @Get("score/:userId")
  async getUserScore(@Param("userId", ParseIntPipe) userId: number) {
    return this.userProgressService.getUserScore(userId);
  }
}
