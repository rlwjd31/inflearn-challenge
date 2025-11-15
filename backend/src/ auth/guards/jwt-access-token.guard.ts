import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAccessTokenGuard extends AuthGuard('jwt-access-token') {}
