import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../application/user/user.service';
import { CreateUserUseCase } from '../application/user/create-user.use-case';
import { IUserRepository } from '../domain/user/user-repository.interface';
import { USER_REPOSITORY_TOKEN } from '../domain/user/user-repository.token';
import { CreateUserDto } from '../infrastructure/web/dto/create-user.dto';

const mockUserRepository = {
  findByEmail: jest.fn(),
  save: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let createUserUseCase: CreateUserUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: CreateUserUseCase,
          useFactory: (userRepository: IUserRepository) => new CreateUserUseCase(userRepository),
          inject: [USER_REPOSITORY_TOKEN],
        },
        { provide: USER_REPOSITORY_TOKEN, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = new CreateUserDto('test@example.com', 'password123');
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue({ id: 1, ...dto });
    const result = await service.create(dto);
    expect(result).toHaveProperty('id');
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('should not create user if email exists', async () => {
    const dto = new CreateUserDto('test@example.com', 'password123');
    mockUserRepository.findByEmail.mockResolvedValue({ id: 1, ...dto });
    await expect(service.create(dto)).rejects.toThrow();
  });
  it('should return null if user not found by email', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    const result = await service.findByEmail('notfound@example.com');
    expect(result).toBeNull();
  });
});
