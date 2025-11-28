import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// * 전역적으로 사용될 Prisma를 정의하기 위함.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
