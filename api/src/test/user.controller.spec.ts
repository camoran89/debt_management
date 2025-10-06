import { UserController } from '../infrastructure/web/controllers/user.controller';
import { UserService } from '../application/user/user.service';
import { CreateUserDto } from '../infrastructure/web/dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;
    controller = new UserController(userService);
  });

  it('should register a user if email not exists', async () => {
  userService.findByEmail.mockResolvedValue(null);
  userService.create.mockResolvedValue({ id: 1, email: 'a', password: 'b', full_name: 'b', phone: 'c', created_at: new Date() });
  const dto = { email: 'a', password: 'b', full_name: 'b', phone: 'c' } as CreateUserDto;
  const result = await controller.register(dto);
  expect(result).toHaveProperty('id');
  });

  it('should throw if email exists', async () => {
  userService.findByEmail.mockResolvedValue({ id: 1, email: 'a', password: 'b', full_name: 'b', phone: 'c', created_at: new Date() });
  const dto = { email: 'a', password: 'b', full_name: 'b', phone: 'c' } as CreateUserDto;
  await expect(controller.register(dto)).rejects.toThrow('Email ya registrado');
  });
});
