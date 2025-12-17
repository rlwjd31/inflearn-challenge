import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SectionEntity } from 'src/sections/entities/section.entity';

export class UpdateSectionDTO extends PartialType(
  PickType(SectionEntity, ['description', 'order', 'title']),
) {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : 1))
  order?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '섹션 제목',
    type: String,
    example: '섹션 제목',
    required: false,
  })
  title?: string;
}
