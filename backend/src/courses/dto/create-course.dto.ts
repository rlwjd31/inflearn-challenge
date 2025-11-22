import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCourseDTO {
  @ApiProperty({ description: '강좌 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '강좌 슬러그(URL에 사용됨)' })
  @IsString()
  slug: string;

  @ApiProperty({ description: '강좌 가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '강좌 1~2줄 짧은 설명' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ description: '강좌 상세페이지 설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '강좌 썸네일 URL' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ description: '강좌 할인 가격' })
  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({
    description: '강좌 난이도. e.g) BEGINNER, INTERMEDIATE, ADVANCED',
  })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiProperty({ description: '강좌 상태. e.g) DRAFT, PUBLISHED, ARCHIVED' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: '강좌 카테고리 ID 목록' })
  @IsArray()
  @IsOptional()
  @IsUUID(undefined, { each: true }) // 각 요소는 UUID 형식임을 검증
  // * DTO에서는 category에 관련된 정보를 다 받아오지 않고, 단순히 ID만 받아오기 때문에 효율적
  categoryIds?: string[];
}
