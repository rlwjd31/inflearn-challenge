import { PartialType } from '@nestjs/swagger';
import { CreateCourseDTO } from 'src/courses/dto/create-course.dto';

export class UpdateCourseDTO extends PartialType(CreateCourseDTO) {}
