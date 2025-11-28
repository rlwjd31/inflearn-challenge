import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { LectureEntity } from 'src/lectures/entities/lecture.entity';

export class CreateLectureDTO extends PickType(LectureEntity, ['title']) {
  @IsNotEmpty()
  @IsString()
  title: string;
}
