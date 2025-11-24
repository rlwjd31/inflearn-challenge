import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDTO } from 'src/sections/dto/create-sections.dto';
import { UpdateSectionDTO } from 'src/sections/dto/update-sections.dto.';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    courseId: string,
    userId: string,
    createSectionDto: CreateSectionDTO,
  ) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new NotFoundException(`ID: ${courseId} 강좌를 찾을 수 없습니다.`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException(
        '강좌의 소유자만 섹션을 생성할 수 있습니다.',
      );
    }

    const lastSection = await this.prisma.section.findFirst({
      where: {
        id: courseId,
      },
      orderBy: {
        order: 'desc',
      },
    });
    const newOrder = (lastSection?.order ?? 1) + 1;

    return this.prisma.section.create({
      data: {
        title: createSectionDto.title,
        order: newOrder,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });
  }

  async findOne(
    sectionId: string,
    userId: string,
    include: Prisma.SectionFindUniqueArgs['include'],
  ) {
    const section = await this.prisma.section.findUnique({
      where: {
        id: sectionId,
        course: {
          instructorId: userId,
        },
      },
      include: {
        ...include,
        course: {
          select: {
            instructorId: true,
          },
        },
        lectures: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!section) {
      throw new NotFoundException(`ID: ${sectionId} 섹션을 찾을 수 없습니다.`);
    }

    if (section.course.instructorId !== userId) {
      throw new UnauthorizedException('섹션의 소유자만 조회할 수 있습니다.');
    }

    return section;
  }

  async update(
    sectionId: string,
    userId: string,
    updateSectionDTO: UpdateSectionDTO,
  ) {
    const section = await this.prisma.section.findUnique({
      where: {
        id: sectionId,
      },
      include: {
        course: true,
      },
    });

    if (!section) {
      throw new NotFoundException(`ID: ${sectionId} 섹션을 찾을 수 없습니다.`);
    }

    if (section.course.instructorId !== userId) {
      throw new UnauthorizedException('섹션의 소유자만 수정할 수 있습니다.');
    }

    return this.prisma.section.update({
      where: {
        id: sectionId,
      },
      data: updateSectionDTO,
    });
  }

  async delete(sectionId: string, userId: string) {
    const section = await this.prisma.section.findUnique({
      where: {
        id: sectionId,
      },
      include: {
        course: true,
      },
    });

    if (!section) {
      throw new NotFoundException(`ID: ${sectionId} 섹션을 찾을 수 없습니다.`);
    }

    if (section.course.instructorId !== userId) {
      throw new UnauthorizedException('섹션의 소유자만 삭제할 수 있습니다.');
    }

    await this.prisma.section.delete({
      where: {
        id: sectionId,
      },
    });

    return section;
  }
}
