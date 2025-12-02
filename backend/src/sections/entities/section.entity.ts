import { ApiProperty } from '@nestjs/swagger';
import { Section } from '@prisma/client';
import { CourseEntity } from 'src/courses/entities/course.entity';
import { LectureEntity } from 'src/lectures/entities/lecture.entity';

import { NullableToUndefined } from 'src/types/nullable-to-undefined-util.type';

export class SectionEntity implements NullableToUndefined<Section> {
  @ApiProperty({
    description: '섹션 고유 식별 ID',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    readOnly: true,
  })
  id: string;

  @ApiProperty({
    description: '섹션 제목',
    type: String,
    example: '섹션 제목',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: '섹션 설명',
    type: String,
    example: '섹션 설명',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '섹션 순서',
    type: Number,
    example: 1,
    required: true,
  })
  order: number;

  @ApiProperty({
    description: '섹션 생성 시간',
    type: Date,
    default: new Date(),
    readOnly: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: '섹션 마지막 업데이트 시간',
    type: Date,
    default: new Date(),
    readOnly: true,
  })
  updatedAt: Date;

  // * FK
  @ApiProperty({
    description: '섹션 코스 ID',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  courseId: string;

  // * relations

  @ApiProperty({
    description: '섹션이 포함된 강좌',
    type: () => CourseEntity,
    required: false,
  })
  course?: CourseEntity;

  @ApiProperty({
    description: '섹션 강의 목록',
    isArray: true,
    type: () => LectureEntity,
    required: false,
  })
  lectures?: LectureEntity[];
}
