import { Module } from '@nestjs/common';
import { AuthController } from 'src/user/auth/auth.controller';
import { AuthService } from 'src/user/auth/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class UserModule {}
