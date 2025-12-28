import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from 'src/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        hashedPassword: true,
      },
    });
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDTO) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: { ...updateUserDto },
      omit: {
        hashedPassword: true,
      },
    });
  }
}
