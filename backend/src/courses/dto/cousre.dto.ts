// FIXME: prisma의 schema를 implements하여 null type을 강제로 작성해야하는 문제

import { ApiProperty } from '@nestjs/swagger';
import {
  Course,
  CourseCategory,
  CourseEnrollment,
  CourseQuestion,
  CourseReview,
  Lecture,
  Section,
} from '@prisma/client';

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class CourseDTO implements Course {
  @ApiProperty({
    description: '강좌 고유 식별 ID',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    readOnly: true, // ✅ 서버에서 자동 생성하는 필드는 readOnly를 넣어주어야 하낟.
  })
  id: string;

  @ApiProperty({
    description: '강좌 슬러그(URL에 사용됨)',
    type: String,
    example: 'course-slug',
    required: true,
  })
  slug: string;

  @ApiProperty({
    description: '강좌 제목',
    type: String,
    example: 'NextJS 15 뿌수기',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: '강좌 1~2줄 짧은 설명',
    type: String,
    required: false,
    nullable: true,
  })
  shortDescription: string | null;

  @ApiProperty({
    description: '강좌 상세페이지 설명',
    type: String,
    required: false,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: '강좌 썸네일 URL',
    type: String,
    required: false,
    nullable: true,
  })
  thumbnailUrl: string | null;

  @ApiProperty({
    description: '강좌 가격(만원 단위)',
    type: Number,
    example: 10000,
    required: true,
  })
  price: number;

  @ApiProperty({
    description: '강좌 할인 가격',
    type: Number,
    required: false,
    nullable: true,
  })
  discountPrice: number | null;

  @ApiProperty({
    description: '강좌 난이도. ',
    enum: CourseLevel,
    example: CourseLevel, // 'beginner', 'intermediate', 'advanced'와 같이 string 형태로 작성을 해야 하나...?
    default: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @ApiProperty({
    description: '강좌 상태. e.g) DRAFT, PUBLISHED, ARCHIVED',
    enum: CourseStatus,
    example: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @ApiProperty({
    description: '강좌 생성 시간',
    type: Date,
    default: new Date(),
    readOnly: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: '강좌가 마지막으로 업데이트 된 시간',
    type: Date,
    default: new Date(),
    readOnly: true,
  })
  updatedAt: Date;

  // * FK
  @ApiProperty({
    description: '강좌 강사 ID',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  instructorId: string;

  // * relations
  @ApiProperty({
    isArray: true,
    // TODO: have to convert Object type to like () => SectionDTO after defined Section
    // TODO: same as lectures, categories, enrollments, reviews, questions
    type: Object,
    required: false,
    nullable: true,
  })
  sections: Section[] | null;

  @ApiProperty({
    isArray: true,
    type: Object,
    required: false,
    nullable: true,
  })
  lectures: Lecture[] | null;

  @ApiProperty({
    isArray: true,
    type: Object,
    required: false,
    nullable: true,
  })
  categories: CourseCategory[] | null;

  @ApiProperty({
    isArray: true,
    type: Object,
    required: false,
    nullable: true,
  })
  enrollments: CourseEnrollment[] | null;

  @ApiProperty({
    isArray: true,
    type: Object,
    required: false,
    nullable: true,
  })
  reviews: CourseReview[] | null;

  @ApiProperty({
    isArray: true,
    type: Object,
    required: false,
    nullable: true,
  })
  questions: CourseQuestion[] | null;
}
