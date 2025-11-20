import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
