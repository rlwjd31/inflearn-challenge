import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  CourseEntity,
  CourseLevel,
  CourseStatus,
} from 'src/courses/entities/course.entity';

class UpdateCourseDTOType extends PartialType(
  PickType(CourseEntity, [
    'title',
    'shortDescription',
    'description',
    'thumbnailUrl',
    'price',
    'discountPrice',
    'level',
    'status',
  ]),
) {}
export class UpdateCourseDTO extends UpdateCourseDTOType {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @IsEnum(CourseLevel)
  @Transform(({ value }) => {
    if (!value) return CourseLevel.BEGINNER;

    const upperValue = (value as string).toUpperCase();
    return CourseLevel[upperValue] ? upperValue : CourseLevel.BEGINNER;
  })
  @IsOptional()
  level: CourseLevel;

  // @ApiProperty({ description: '강좌 상태. e.g) DRAFT, PUBLISHED, ARCHIVED' })
  @IsEnum(CourseStatus)
  @Transform(({ value }) => {
    if (!value) return CourseStatus.DRAFT;

    const upperValue = (value as string).toUpperCase();
    return CourseStatus[upperValue] ? upperValue : CourseStatus.DRAFT;
  })
  @IsOptional()
  status: CourseStatus;

  // 해당 field는 create, update course에서 값을 편하게 넣어주기 위한 값임
  @ApiProperty({
    description: '강좌 카테고리 ID 목록',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsUUID(undefined, { each: true }) // 각 요소는 UUID 형식임을 검증
  // * DTO에서는 category에 관련된 정보를 다 받아오지 않고, 단순히 ID만 받아오기 때문에 효율적
  categoryIds?: string[];
}
