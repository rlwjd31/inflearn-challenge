import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JWTAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH_SECRET as string,
    });
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: Express.User) {
    // payload는 실제로 내가 jwt에 담아둔 정보이지만 지금은 jwt에 기본적으로 담기는 것으로 type지정함.
    // jwt payload에서 중요한 건 사실 userId를 나타내는 `sub`말고는 없긴 하다.
    // 그리고 원하는 property name으로 { userId: payload.sub, username: payload.username }와 같이 return하면 되며
    // 이 값은 guard에 의해 req.user에 부착이되어 response이전까지 request가 살아있는 동안 내가 return한 정보들이 계속 살아있게 된다.
    return payload;
  }
}
