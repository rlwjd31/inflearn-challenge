import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SectionEntity } from 'src/sections/entities/section.entity';

export class CreateSectionDTO extends PickType(SectionEntity, ['title']) {
  @IsString()
  title: string;
}
