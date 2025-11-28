import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SectionEntity } from 'src/sections/entities/section.entity';

export class UpdateSectionDTO extends PickType(SectionEntity, [
  'description',
  'order',
]) {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : 1))
  order: number;
}
