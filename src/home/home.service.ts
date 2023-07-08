import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaSerivce: PrismaService) {}

  async getHomes(): Promise<HomeResponseDto[]> {
    const homes = await this.prismaSerivce.home.findMany();
    return homes.map((home) => new HomeResponseDto(home));
  }
}
