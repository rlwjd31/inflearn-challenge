import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDTO } from 'src/sections/dto/create-sections.dto';
import { UpdateSectionDTO } from 'src/sections/dto/update-sections.dto.';
import { SectionEntity } from 'src/sections/entities/section.entity';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: 일단은 두고 어떻게 하면 공통된 로직(section.findUnique)와 에러처리를 진행할 수 있는지 고민해보기
  // TODO: 1. useGuard, 2. 현재 방법
  private async validateSectionContext<T extends SectionEntity>({
    sectionId,
    courseId,
    userId,
  }: {
    fetchSection?: () => Promise<T | null>;
    sectionId?: string;
    courseId?: string;
    userId: string;
  }) {
    if (sectionId) {
      const section = await this.prisma.section.findUnique({
        where: {
          id: sectionId,
        },
        include: {
          course: { select: { instructorId: true } },
        },
      });

      if (!section) {
        throw new NotFoundException(
          `ID: ${sectionId} 섹션을 찾을 수 없습니다.`,
        );
      }

      if (section.course.instructorId !== userId) {
        throw new UnauthorizedException('섹션의 소유자만 작업할 수 있습니다.');
      }
    }

    if (courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: { instructorId: true },
      });

      if (!course) {
        throw new NotFoundException(`ID: ${courseId} 강좌를 찾을 수 없습니다.`);
      }

      if (course.instructorId !== userId) {
        throw new UnauthorizedException('강좌의 소유자만 작업할 수 있습니다.');
      }
    }
  }

  async create(
    courseId: string,
    userId: string,
    createSectionDto: CreateSectionDTO,
  ) {
    await this.validateSectionContext({ userId, courseId });

    const lastSection = await this.prisma.section.findFirst({
      where: {
        id: courseId,
      },
      orderBy: {
        order: 'desc',
      },
    });
    const newOrder = (lastSection?.order ?? 0) + 1;

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
    include?: Prisma.SectionFindUniqueArgs['include'],
  ) {
    const section = await this.prisma.section.findUnique({
      where: {
        id: sectionId,
        course: {
          instructorId: userId,
        },
      },
      include: {
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
        ...include,
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
