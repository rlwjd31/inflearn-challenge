import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWTAccessTokenStrategy } from 'src/auth/strategies/jwt-access-token.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [JWTAccessTokenStrategy],
})
export class AuthModule {}
