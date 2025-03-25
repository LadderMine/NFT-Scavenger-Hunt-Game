import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import type { VideoService } from "../services/video.service"
import type { VideoUploadService } from "../services/video-upload.service"
import type { VideoStreamingService } from "../services/video-streaming.service"
import type { CreateVideoDto } from "../dto/create-video.dto"
import type { UpdateVideoDto } from "../dto/update-video.dto"
import type { VideoQueryDto } from "../dto/video-query.dto"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import type { Request, Response } from "express"
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from "@nestjs/swagger"

@ApiTags("videos")
@Controller("videos")
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoUploadService: VideoUploadService,
    private readonly videoStreamingService: VideoStreamingService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload a new video" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        title: {
          type: "string",
        },
        description: {
          type: "string",
        },
        visibility: {
          type: "string",
          enum: ["public", "private", "unlisted"],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "The video has been successfully uploaded." })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
    @Req() req: Request,
  ) {
    // Add user ID from JWT token
    createVideoDto.userId = req.user["id"]

    return this.videoUploadService.uploadVideo(file, createVideoDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({ status: 200, description: 'Return all videos matching the query.' })
  async findAll(@Query() query: VideoQueryDto) {
    const [videos, total] = await this.videoService.findAll(query);
    return {
      data: videos,
      total,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a video by ID' })
  @ApiResponse({ status: 200, description: 'Return the video.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.videoService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update a video" })
  @ApiResponse({ status: 200, description: "The video has been successfully updated." })
  @ApiResponse({ status: 404, description: "Video not found." })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateVideoDto: UpdateVideoDto, @Req() req: Request) {
    // Check if user owns the video
    const video = await this.videoService.findOne(id)
    if (video.userId !== req.user["id"]) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: "You do not have permission to update this video",
      }
    }

    return this.videoService.update(id, updateVideoDto)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete a video" })
  @ApiResponse({ status: 200, description: "The video has been successfully deleted." })
  @ApiResponse({ status: 404, description: "Video not found." })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    // Check if user owns the video
    const video = await this.videoService.findOne(id)
    if (video.userId !== req.user["id"]) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: "You do not have permission to delete this video",
      }
    }

    await this.videoService.remove(id)
    return {
      statusCode: HttpStatus.OK,
      message: "Video deleted successfully",
    }
  }

  @Get(":id/stream")
  @ApiOperation({ summary: "Stream a video" })
  @ApiResponse({ status: 200, description: "Stream the video." })
  @ApiResponse({ status: 206, description: "Stream a part of the video (partial content)." })
  @ApiResponse({ status: 404, description: "Video not found." })
  async streamVideo(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request, @Res() res: Response) {
    const range = req.headers.range
    const userId = req.user ? req.user["id"] : undefined

    await this.videoStreamingService.streamVideo(id, range, res, userId)
  }

  @Get(":id/signed-url")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get a signed URL for a video" })
  @ApiResponse({ status: 200, description: "Return a signed URL for the video." })
  @ApiResponse({ status: 404, description: "Video not found." })
  async getSignedUrl(@Param('id', ParseUUIDPipe) id: string, @Query('expiresIn') expiresIn: number = 3600) {
    const url = await this.videoService.getSignedUrl(id, expiresIn)
    return { url }
  }
}

