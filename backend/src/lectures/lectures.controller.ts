import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';

import { LecturesService } from './lectures.service';
import { JWTAccessTokenGuard } from 'src/ auth/guards/jwt-access-token.guard';
import { LectureEntity } from 'src/lectures/entities/lecture.entity';
import { CreateLectureDTO } from 'src/lectures/dto/create-lecture.dto';
import { UpdateLectureDTO } from 'src/lectures/dto/update-lecture.dto';

@ApiTags('Lectures')
@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Post('/sections/:sectionId/lectures')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '개별 강의 생성',
  })
  @ApiParam({
    name: 'sectionId',
    required: true,
    description: '섹션 고유 식별 ID',
  })
  @ApiBody({ type: CreateLectureDTO, description: '강의 생성에 필요한 정보' })
  @ApiOkResponse({
    description: '강의 생성 성공',
    type: LectureEntity,
  })
  create(
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Body() createLectureDTO: CreateLectureDTO,
    @Request() req: ExpressRequest,
  ) {
    return this.lecturesService.create(
      sectionId,
      createLectureDTO,
      req.user?.sub as string,
    );
  }

  @Get(':lectureId')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '개별 강의 상세 조회 성공' })
  @ApiParam({
    name: 'lectureId',
    required: true,
    description: '강의 고유 식별 ID',
  })
  @ApiOkResponse({ description: '강의 상세 정보', type: LectureEntity })
  findOne(
    @Param('lectureId', ParseUUIDPipe) lectureId: string,
    @Request() req: ExpressRequest,
  ) {
    return this.lecturesService.findOne(lectureId, req.user?.sub as string);
  }

  @Patch(':lectureId')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '개별 강의 상세 수정 성공' })
  @ApiParam({
    name: 'lectureId',
    required: true,
    description: '강의 고유 식별 ID',
  })
  @ApiBody({
    type: UpdateLectureDTO,
    description: '강의 수정에 필요한 정보',
  })
  @ApiOkResponse({ description: '강의 상세 정보', type: LectureEntity })
  update(
    @Param('lectureId', ParseUUIDPipe) lectureId: string,
    @Body() updateLectureDTO: UpdateLectureDTO,
    @Request() req: ExpressRequest,
  ) {
    return this.lecturesService.update(
      lectureId,
      updateLectureDTO,
      req.user?.sub as string,
    );
  }

  @Delete(':lectureId')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '개별 강의 삭제 성공' })
  @ApiParam({ name: 'lectureId', required: true, description: '개별 강의 ID' })
  @ApiOkResponse({
    description: '개별 강의 삭제 성공',
    type: LectureEntity,
  })
  delete(
    @Param('lectureId', ParseUUIDPipe) lectureId: string,
    @Request() req: ExpressRequest,
  ) {
    return this.lecturesService.delete(lectureId, req.user?.sub as string);
  }
}

// courseId: d7390a02-4cf3-436a-ab5f-557d68cc8889
// sectionId: 9020fa04-adfb-4b0f-beff-150f690f8258
// lectureId: 6fd3a798-0715-44ab-87e4-baf53c164167
