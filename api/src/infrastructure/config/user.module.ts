import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/user/user.entity';
import { UserService } from '../../application/user/user.service';
import { UserController } from '../web/controllers/user.controller';
import { AuthService } from '../../application/user/auth.service';
import { AuthController } from '../web/controllers/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../web/guards/jwt.strategy';
import { UserRepository } from '../repositories/user.repository';
import { IUserRepository } from '../../domain/user/user-repository.interface';
import { CreateUserUseCase } from '../../application/user/create-user.use-case';
import { LoginUserUseCase } from '../../application/user/login-user.use-case';


export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'admin123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: IUserRepository) => new CreateUserUseCase(userRepository),
      inject: ['USER_REPOSITORY_TOKEN'],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (userRepository: IUserRepository, jwtService: JwtService) => new LoginUserUseCase(userRepository, jwtService),
      inject: ['USER_REPOSITORY_TOKEN', JwtService],
    },
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepository },
  ],
  controllers: [UserController, AuthController],
  exports: [UserService, AuthService, USER_REPOSITORY_TOKEN, CreateUserUseCase],
})
export class UserModule {}
