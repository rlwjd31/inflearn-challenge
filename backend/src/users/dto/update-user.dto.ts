import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

export class UpdateUserDTO extends PickType(UserEntity, [
  'name',
  'bio',
  'imageUrl',
]) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
