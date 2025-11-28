import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLectureDTO } from 'src/lectures/dto/create-lecture.dto';
import { UpdateLectureDTO } from 'src/lectures/dto/update-lecture.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LecturesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    sectionId: string,
    createLectureDto: CreateLectureDTO,
    userId: string,
  ) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        course: {
          select: { instructorId: true },
        },
      },
    });

    if (!section) {
      throw new NotFoundException(`ID: ${sectionId} 섹션을 찾을 수 없습니다.`);
    }

    if (section.course.instructorId !== userId) {
      throw new UnauthorizedException(
        '섹션의 소유자만 강의를 생성할 수 있습니다.',
      );
    }

    const lastLecture = await this.prisma.lecture.findFirst({
      where: {
        sectionId,
      },
      orderBy: {
        order: 'desc',
      },
    });
    const newOrder = (lastLecture?.order ?? 0) + 1;

    return this.prisma.lecture.create({
      data: {
        ...createLectureDto,
        order: newOrder,
        section: {
          connect: {
            id: sectionId,
          },
        },
        course: {
          connect: {
            id: section.courseId,
          },
        },
      },
    });
  }

  async update(
    lectureId: string,
    updateLectureDTO: UpdateLectureDTO,
    userId: string,
  ) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException(`ID: ${lectureId} 강의를 찾을 수 없습니다.`);
    }

    if (lecture.course.instructorId !== userId) {
      throw new UnauthorizedException('강의의 소유자만 수정할 수 있습니다.');
    }

    return this.prisma.lecture.update({
      where: { id: lectureId },
      data: updateLectureDTO,
    });
  }

  async findOne(lectureId: string, userId: string) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException(`ID: ${lectureId} 강의를 찾을 수 없습니다.`);
    }

    if (lecture.course.instructorId !== userId) {
      throw new UnauthorizedException('강의의 소유자만 조회할 수 있습니다.');
    }

    return lecture;
  }

  async delete(lectureId: string, userId: string) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException(`ID: ${lectureId} 강의를 찾을 수 없습니다.`);
    }

    if (lecture.course.instructorId !== userId) {
      throw new UnauthorizedException('강의의 소유자만 삭제할 수 있습니다.');
    }

    await this.prisma.lecture.delete({
      where: { id: lectureId },
    });

    return lecture;
  }
}
