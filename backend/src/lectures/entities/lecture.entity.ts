import { ApiProperty } from '@nestjs/swagger';
import { Lecture, LectureActivity } from '@prisma/client';
import { CourseEntity } from 'src/courses/entities/course.entity';
import { SectionEntity } from 'src/sections/entities/section.entity';

import { NullableToUndefined } from 'src/types/nullable-to-undefined-util.type';

export class LectureEntity implements NullableToUndefined<Lecture> {
  @ApiProperty({
    description: '강의 고유 식별 ID',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    readOnly: true,
  })
  id: string;

  @ApiProperty({
    description: '강의 제목',
    type: String,
    example: '강의 제목',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: '강의 설명',
    type: String,
    example: '강의 설명',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '강의 순서',
    type: Number,
    example: 1,
    required: true,
  })
  order: number;

  @ApiProperty({
    description: '강의 재생 시간',
    type: Number,
    example: 100,
    required: false,
  })
  duration?: number;

  @ApiProperty({
    description: '강의 미리보기 여부',
    type: Boolean,
    example: false,
    default: false,
    required: false,
  })
  isPreview: boolean;

  @ApiProperty({
    description: '강의 비디오 업로드 정보',
    type: Object,
    example: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    required: false,
  })
  videoStorageInfo?: Record<string, any>;

  @ApiProperty({
    description: '강의 생성 시간',
    type: Date,
    default: new Date(),
    readOnly: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: '강의 마지막 업데이트 시간',
    type: Date,
    default: new Date(),
    readOnly: true,
  })
  updatedAt: Date;

  // * FK
  @ApiProperty({
    description: '강의 섹션 ID',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  sectionId: string;

  @ApiProperty({
    description: '강의 코스 ID',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  courseId: string;

  // * relations
  @ApiProperty({
    description: '강의가 포함된 강좌',
    type: CourseEntity,
    required: false,
  })
  course?: CourseEntity;

  @ApiProperty({
    description: '강의가 포함된 섹션',
    type: SectionEntity,
    required: false,
  })
  section?: SectionEntity;

  @ApiProperty({
    description: '강의 활동 목록',
    // TODO: have to convert Object type to like () => LectureActivityDTO after defined LectureActivity
    type: Object,
    isArray: true,
    required: false,
  })
  activities?: LectureActivity[];
}
