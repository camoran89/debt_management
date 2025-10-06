import { Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../domain/user/user-repository.interface';
import { UserEntity } from '../../domain/user/user.entity';
import { CreateUserDto } from '../../infrastructure/web/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email ya registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new UserEntity(
      createUserDto.email,
      hashedPassword,
      createUserDto.full_name,
      createUserDto.phone,
    );

    return this.userRepository.save(user);
  }
}
