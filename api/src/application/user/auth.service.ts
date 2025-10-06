import { Injectable } from '@nestjs/common';
import { LoginUserUseCase } from '../../application/user/login-user.use-case';
import { LoginUserDto } from '../../infrastructure/web/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  async login(loginUserDto: LoginUserDto) {
    return this.loginUserUseCase.execute(loginUserDto);
  }
}
