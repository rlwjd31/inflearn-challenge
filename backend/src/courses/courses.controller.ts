import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JWTAccessTokenGuard } from 'src/auth/guards/jwt-access-token.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';
import { Prisma } from '@prisma/client';

import { CreateCourseDTO } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDTO } from 'src/courses/dto/update-course.dto';
import { CourseEntity } from 'src/courses/entities/course.entity';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '강좌 생성',
    type: CourseEntity,
  })
  create(
    @Request() req: ExpressRequest,
    @Body() createCourseDTO: CreateCourseDTO,
  ) {
    return this.coursesService.create(req.user?.sub as string, createCourseDTO);
  }

  @Get()
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiOkResponse({
    description: '강좌 목록',
    isArray: true,
    type: CourseEntity,
  })
  findAll(
    @Query('title') title?: string,
    @Query('level') level?: string,
    @Query('categoryId') categoryId?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.coursesService.findAll({
      where: {
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
        categories: categoryId ? { some: { id: categoryId } } : undefined,
        level,
      },
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  @ApiQuery({
    name: 'include',
    required: false,
    description: 'sections, lectures, courseReviews 등 포함한 관계 지정',
  })
  @ApiOkResponse({
    description: '강좌 상세 정보',
    type: CourseEntity,
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('include') include?: string,
  ) {
    const includeArray = include ? include.split(',') : [];
    const includeObject: Prisma.CourseFindUniqueArgs['include'] =
      Object.fromEntries(includeArray.map((v) => [v, true]));

    return this.coursesService.findOne(id, includeObject);
  }

  @Patch(':id')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '강좌 수정',
    type: CourseEntity,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: ExpressRequest,
    @Body() updateCourseDTO: UpdateCourseDTO,
  ) {
    return this.coursesService.update(
      id,
      req.user?.sub as string,
      updateCourseDTO,
    );
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JWTAccessTokenGuard)
  @ApiOkResponse({
    description: '강좌 삭제',
    type: CourseEntity,
  })
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: ExpressRequest,
  ) {
    return this.coursesService.delete(id, req.user?.sub as string);
  }
}
