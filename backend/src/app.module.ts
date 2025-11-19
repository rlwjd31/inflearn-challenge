import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/ auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({}), PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
