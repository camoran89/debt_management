import { JwtStrategy } from '../infrastructure/web/guards/jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  it('should validate and return user if payload is valid', async () => {
    const strategy = new JwtStrategy();
    const payload = { sub: 1, email: 'test@example.com' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({ userId: 1, email: 'test@example.com' });
  });
});
