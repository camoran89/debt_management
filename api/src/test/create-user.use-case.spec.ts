import { CreateUserUseCase } from '../application/user/create-user.use-case';
import { IUserRepository } from '../domain/user/user-repository.interface';
import { CreateUserDto } from '../infrastructure/web/dto/create-user.dto';
import { UserEntity } from '../domain/user/user.entity';
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));
import * as bcrypt from 'bcryptjs';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
    };
    useCase = new CreateUserUseCase(userRepository);
  });

  it('should create a user if email does not exist', async () => {
    const dto = { email: 'test@example.com', password: 'pass', full_name: 'Test', phone: '123' } as CreateUserDto;
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.save.mockImplementation(async (user) => ({ ...user, id: 1 } as UserEntity));
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    const result = await useCase.execute(dto);
    expect(result).toHaveProperty('id');
    expect(userRepository.save).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
  });

  it('should throw if email exists', async () => {
    const dto = { email: 'test@example.com', password: 'pass', full_name: 'Test', phone: '123' } as CreateUserDto;
    userRepository.findByEmail.mockResolvedValue({ id: 1 } as UserEntity);
    await expect(useCase.execute(dto)).rejects.toThrow('Email ya registrado');
  });
});
