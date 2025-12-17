import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { CourseEntity } from 'src/courses/entities/course.entity';

export class CreateCourseDTO extends PickType(CourseEntity, ['title']) {
  @IsString()
  @IsNotEmpty()
  title: string;
}
