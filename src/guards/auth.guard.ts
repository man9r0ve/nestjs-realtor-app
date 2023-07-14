import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

export class AuthGuard implements CanActivate {
  constructor(private readonly refelctor: Reflector) {}

  async canActivate(context: ExecutionContext) {
    // 1) Determine the UserTypess that can excute the called endpoint
    const roles = this.refelctor.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(roles);
    if (roles?.length) {
      // 2) Grab the JWT from the request header and verify it
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        const user = jwt.verify(token, process.env.JSON_TOKEN_KEY);
        console.log({ user });

        return true;
      } catch (error) {
        return false;
      }
    }

    // 3) Database request to get user by id
    // 4) Determine if the user can permission
    return true;
  }
}
