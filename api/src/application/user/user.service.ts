import { Injectable, Inject } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/user/create-user.use-case';
import { IUserRepository } from '../../domain/user/user-repository.interface';
import { UserEntity } from '../../domain/user/user.entity';
import { CreateUserDto } from '../../infrastructure/web/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject('USER_REPOSITORY_TOKEN') private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.createUserUseCase.execute(createUserDto);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }
}
