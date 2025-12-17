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
  // ? validationpipe에서 transform:true로 했기 때문애 isPreview?: boolean을 보고 알아서 type변환을 하지만 그냥 공부용으로 명시적으로 transform을 사용함.
  @Transform(({ value }) => Boolean(value))
  isPreview?: boolean;

  @IsObject()
  @IsOptional()
  videoStorageInfo?: Record<string, any>;
}
