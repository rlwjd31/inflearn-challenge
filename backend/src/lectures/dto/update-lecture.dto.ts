import { PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { LectureEntity } from 'src/lectures/entities/lecture.entity';

export class UpdateLectureDTO extends PartialType(
  PickType(LectureEntity, [
    'description',
    'order',
    'duration',
    'isPreview',
    'videoStorageInfo',
  ]),
) {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : 1))
  @IsOptional()
  order?: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value ? value === 'true' : false))
  isPreview?: boolean;

  @IsObject()
  @IsOptional()
  videoStorageInfo?: Record<string, any>;
}
