import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { CourseEntity } from 'src/courses/entities/course.entity';

export class CreateCourseDTO extends PickType(CourseEntity, ['title']) {
  @IsString()
  title: string;
}
