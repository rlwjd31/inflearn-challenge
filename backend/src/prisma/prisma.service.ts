import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  // nest가 종료 시 prisma 연결 종료
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
