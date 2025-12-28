import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';

import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from './users.service';
import { JWTAccessTokenGuard } from 'src/auth/guards/jwt-access-token.guard';
import { UpdateUserDTO } from 'src/users/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '유저 프로필 조회 성공',
    type: UserEntity,
  })
  getProfile(@Request() req: ExpressRequest) {
    return this.usersService.getProfile(req.user?.sub as string);
  }

  @Patch('profile')
  @UseGuards(JWTAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '유저 프로필 수정 성공',
    type: UserEntity,
  })
  updateProfile(
    @Request() req: ExpressRequest,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return this.usersService.updateProfile(
      req.user?.sub as string,
      updateUserDTO,
    );
  }
}
