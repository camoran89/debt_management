import { AuthController } from '../infrastructure/web/controllers/auth.controller';
import { AuthService } from '../application/user/auth.service';
import { LoginUserDto } from '../infrastructure/web/dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    authService = { login: jest.fn() } as any;
    controller = new AuthController(authService);
  });

  it('should login and return token', async () => {
  authService.login.mockResolvedValue({ access_token: 'token', user: { id: 1, email: 'a', full_name: 'b', phone: 'c' } });
    const dto = { email: 'a', password: 'b' } as LoginUserDto;
    const result = await controller.login(dto);
    expect(result).toHaveProperty('access_token', 'token');
  });
});
