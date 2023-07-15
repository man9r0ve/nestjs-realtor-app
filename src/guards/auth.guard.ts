import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

interface JWTPayload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly refelctor: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // 1) Determine the UserTypess that can excute the called endpoint
    const roles = this.refelctor.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // console.log(roles);
    if (roles?.length) {
      // 2) Grab the JWT from the request header and verify it
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        const payload = (await jwt.verify(
          token,
          process.env.JSON_TOKEN_KEY,
        )) as JWTPayload;
        console.log({ payload });

        // 3) Database request to get user by id
        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
        });

        if (!user) {
          return false;
        }
        console.log({ user });

        // 4) Determine if the user can permission
        if (!roles.includes(user.user_type)) {
          return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    }

    return true;
  }
}
