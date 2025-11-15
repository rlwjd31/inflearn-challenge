import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JWTAccessTokenGuard } from 'src/ auth/guards/jwt-access-token.guard';
import { Request as ExpressRequest } from 'express';

type JWTPayload = {
  sub: string;
  username: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // TODO: 임시 test code이므로 추후 auth controller로 이전 해야 함.
  // @FIXME: 401, Unauthorized 에러 발생
  @Get('user-test')
  @UseGuards(JWTAccessTokenGuard) // @UseGuards(new JWTAccessTokenGuard())와 같이 되는 것이므로 해당 전략을 사용하기 위해서 module에서 import를 따로 할 필요가 없다.
  testUser(@Request() req: ExpressRequest & { user: JWTPayload }): JWTPayload {
    console.log(req);

    return req.user;
  }
}
