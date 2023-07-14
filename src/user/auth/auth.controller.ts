import {
  Controller,
  Post,
  Body,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import {
  SignupDto,
  SigninDto,
  GenerateProductKeyDto,
} from 'src/user/auth/dto/auth.dto';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { User, UserInfo } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      console.log(`validProductKey: ${validProductKey}`);

      const isValidPassword = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );
      console.log(`isValidPassword: ${isValidPassword}`);

      if (!isValidPassword) {
        throw new UnauthorizedException();
      }
    }

    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('/key')
  generateProductKey(@Body() { email, userType }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }

  @Get('/me')
  me(@User() user: UserInfo) {
    return user;
  }
}
