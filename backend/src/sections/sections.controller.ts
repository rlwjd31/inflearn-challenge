import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import { JWTAccessTokenGuard } from 'src/ auth/guards/jwt-access-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateSectionDTO } from 'src/sections/dto/create-sections.dto';
import type { Request as ExpressRequest } from 'express';
import { SectionEntity } from 'src/sections/entities/section.entity';
import { UpdateSectionDTO } from 'src/sections/dto/update-sections.dto.';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('courses/:courseId/sections')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '세 섹션 생성',
    description:
      '세 섹션을 제목만을 가지고 생성. 추후에 update로 섹션을 최종적으로 추가',
  })
  @ApiParam({
    name: 'courseId',
    required: true,
    description: '강좌 고유 식별 ID',
  })
  @ApiBody({
    type: CreateSectionDTO,
    description: '섹션 생성에 필요한 정보',
  })
  @ApiOkResponse({
    description: '섹션 생성 성공',
    type: SectionEntity,
  })
  create(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() createSectionDTO: CreateSectionDTO,
    @Request() req: ExpressRequest,
  ) {
    return this.sectionsService.create(
      courseId,
      req.user?.sub as string,
      createSectionDTO,
    );
  }

  @Get(':sectionId')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '섹션 상세 조회',
    description: '섹션 상세 정보를 조회',
  })
  @ApiParam({
    name: 'sectionId',
    required: true,
    description: '섹션 고유 식별 ID',
  })
  @ApiOkResponse({
    description: '섹션 상세 정보',
    type: SectionEntity,
  })
  fineOne(
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Request() req: ExpressRequest,
  ) {
    return this.sectionsService.findOne(sectionId, req.user?.sub as string);
  }

  @Patch(':sectionId')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '섹션 수정',
    description: '섹션 정보를 수정',
  })
  @ApiParam({
    name: 'sectionId',
    required: true,
    description: '섹션 고유 식별 ID',
  })
  @ApiBody({
    type: UpdateSectionDTO,
    description: '섹션 수정에 필요한 정보',
  })
  @ApiOkResponse({
    description: '섹션 수정 성공',
    type: SectionEntity,
  })
  update(
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Body() updateSectionDTO: UpdateSectionDTO,
    @Request() req: ExpressRequest,
  ) {
    return this.sectionsService.update(
      sectionId,
      req.user?.sub as string,
      updateSectionDTO,
    );
  }

  @Delete(':sectionId')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '섹션 삭제',
    description: '섹션을 db에서 삭제',
  })
  @ApiParam({
    name: 'sectionId',
    required: true,
    description: '섹션 고유 식별 ID',
  })
  @ApiOkResponse({
    description: '섹션 삭제 성공',
    type: SectionEntity,
  })
  delete(
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Request() req: ExpressRequest,
  ) {
    return this.sectionsService.delete(sectionId, req.user?.sub as string);
  }
}
