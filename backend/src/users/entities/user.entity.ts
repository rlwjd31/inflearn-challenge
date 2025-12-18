import { ApiProperty } from '@nestjs/swagger';
import { Account, Session, User } from '@prisma/client';
import { NullableToUndefined } from 'src/types/nullable-to-undefined-util.type';

export class UserEntity implements NullableToUndefined<User> {
  @ApiProperty({
    description: '유저 고유 식별 ID',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    readOnly: true,
  })
  id: string;

  @ApiProperty({
    description: '유저 이름',
    type: String,
    example: 'gijung park',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: '유저 이메일',
    type: String,
    example: 'gijungpark@gmail.com',
    readOnly: true,
  })
  email: string;

  @ApiProperty({
    description: '유저 이메일 인증 여부',
    type: Boolean,
    example: false,
  })
  emailVerified?: Date;

  @ApiProperty({
    description: '유저 비밀번호',
    type: String,
    example: 'password',
    required: false,
  })
  hashedPassword?: string;

  @ApiProperty({
    description: '유저 프로필 이미지 URL',
    type: String,
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    isArray: true,
    // TODO: have to convert Object type to like () => AccountDTO after defined Account
    type: Object,
    required: false,
  })
  accounts?: Account[];

  @ApiProperty({
    isArray: true,
    // TODO: have to convert Object type to like () => SessionDTO after defined Session
    type: Object,
    required: false,
  })
  sessions?: Session[];
}
