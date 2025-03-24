import { Injectable, type CanActivate, type ExecutionContext, NotFoundException } from "@nestjs/common"
import type { VideoService } from "../services/video.service"
import { VideoVisibility } from "../entities/video.entity"

@Injectable()
export class VideoAccessGuard implements CanActivate {
  constructor(private videoService: VideoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const videoId = request.params.id
    const user = request.user

    // If no video ID, allow access
    if (!videoId) {
      return true
    }

    try {
      const video = await this.videoService.findOne(videoId)

      // Public videos are accessible to everyone
      if (video.visibility === VideoVisibility.PUBLIC) {
        return true
      }

      // Private videos are only accessible to the owner
      if (video.visibility === VideoVisibility.PRIVATE) {
        return user && video.userId === user.id
      }

      // Unlisted videos are accessible with the link
      if (video.visibility === VideoVisibility.UNLISTED) {
        return true
      }

      return false
    } catch (error) {
      // If video not found, throw NotFoundException
      throw new NotFoundException("Video not found")
    }
  }
}

