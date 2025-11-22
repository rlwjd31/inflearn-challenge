import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { CreateCourseDTO } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDTO } from 'src/courses/dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createCourseDTO: CreateCourseDTO,
  ): Promise<Course> {
    const { categoryIds, ...otherData } = createCourseDTO;

    return this.prisma.course.create({
      data: {
        ...otherData,
        categories: {
          connect: (categoryIds ?? []).map((id) => ({ id })),
        },
        instructorId: userId,
      },
    });
  }

  async findAll(params: Prisma.CourseFindManyArgs): Promise<Course[]> {
    return this.prisma.course.findMany({ ...params });
  }

  async findOne(
    id: string,
    include: Prisma.CourseFindUniqueArgs['include'],
  ): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include,
    });
  }

  async update(
    id: string,
    userId: string,
    updateCourseDTO: UpdateCourseDTO,
  ): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`ID: ${id} 강좌를 찾을 수 없습니다.`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException('강의의 소유자만 수정할 수 있습니다.');
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDTO,
    });
  }

  async delete(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`ID: ${id} 강좌를 찾을 수 없습니다.`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException('강의의 소유자만 삭제할 수 있습니다.');
    }

    return this.prisma.course.delete({
      where: { id },
    });
  }
}
