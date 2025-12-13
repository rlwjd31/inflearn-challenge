import {
  BadRequestException,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTAccessTokenGuard } from 'src/auth/guards/jwt-access-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
} from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 300 * 1024 * 1024, // 300MB
      },
    }),
  )
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data') // Endpoint가 받는 Content-Type을 명시함
  @ApiBody({
    description: '미디어 업로드 요청 파일',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '이미지(png, jpg) 또는 비디오 (mp4 등)',
        },
      },
    },
  })
  @ApiOkResponse({
    description: '파일 업로드 결과(VideoStorageInfo)',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: ExpressRequest,
  ) {
    if (!file) {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }

    return this.mediaService.uploadMedia(file, req.user?.sub as string);
  }
}
