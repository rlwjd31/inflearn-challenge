import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    const { categoryIds, ...otherData } = createCourseDto;

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
    updateCourseDto: UpdateCourseDto,
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
      data: updateCourseDto,
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

  // async findAll(params: {
  //   skip?: number;
  //   take?: number;
  //   cursor: Prisma.CourseWhereUniqueInput;
  //   where?: Prisma.CourseWhereInput;
  //   orderBy?: Prisma.CourseOrderByWithRelationInput
  // }): Promise<Course[]> {

  //   const { skip, take, cursor, where, orderBy } = params;
  //   return this.prisma.course.findMany({
  //     skip,
  //     take,
  //     cursor,
  //     where,
  //     orderBy,
  //   });
  // }
}
