import { ApiProperty } from '@nestjs/swagger';
import { CourseCategory } from '@prisma/client';
import { NullableToUndefined } from 'src/types/nullable-to-undefined-util.type';

export class CategoryEntity implements NullableToUndefined<CourseCategory> {
  @ApiProperty({
    description: '카테고리 고유 식별 ID',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    readOnly: true,
  })
  id: string;

  @ApiProperty({
    description: '카테고리 이름',
    type: String,
    example: '카테고리 이름',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: '카테고리 슬러그',
    type: String,
    example: '카테고리-슬러그',
    required: true,
  })
  slug: string;

  @ApiProperty({
    description: '카테고리 설명',
    type: String,
    example: '카테고리 설명',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '카테고리 생성 시간',
    type: Date,
    default: new Date(),
    readOnly: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: '카테고리 마지막 업데이트 시간',
    type: Date,
    default: new Date(),
    readOnly: true,
  })
  updatedAt: Date;
}
