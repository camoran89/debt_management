import { LoginUserUseCase } from '../application/user/login-user.use-case';
import { IUserRepository } from '../domain/user/user-repository.interface';
import { LoginUserDto } from '../infrastructure/web/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));
import * as bcrypt from 'bcryptjs';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtService: JwtService;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
    };
    jwtService = { sign: jest.fn().mockReturnValue('token') } as any;
    useCase = new LoginUserUseCase(userRepository, jwtService);
  });

  it('should return token and user if credentials are valid', async () => {
    const dto = { email: 'test@example.com', password: 'pass' } as LoginUserDto;
    const user = { id: 1, email: dto.email, password: 'hashed', full_name: 'Test', phone: '123' };
    userRepository.findByEmail.mockResolvedValue(user as any);
  (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await useCase.execute(dto);
    expect(result).toHaveProperty('access_token', 'token');
    expect(result.user).toMatchObject({ id: 1, email: dto.email });
  });

  it('should throw if user not found', async () => {
    const dto = { email: 'test@example.com', password: 'pass' } as LoginUserDto;
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(useCase.execute(dto)).rejects.toThrow('Credenciales inválidas');
  });

  it('should throw if password is invalid', async () => {
    const dto = { email: 'test@example.com', password: 'pass' } as LoginUserDto;
    const user = { id: 1, email: dto.email, password: 'hashed', full_name: 'Test', phone: '123' };
    userRepository.findByEmail.mockResolvedValue(user as any);
  (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(useCase.execute(dto)).rejects.toThrow('Credenciales inválidas');
  });
});
