import { UserEntity } from '../domain/user/user.entity';

describe('UserEntity', () => {
  it('should create a user entity with required fields', () => {
    const user = new UserEntity('test@example.com', 'pass', 'Test', '123');
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('pass');
    expect(user.full_name).toBe('Test');
    expect(user.phone).toBe('123');
    expect(user.id).toBeUndefined();
  });
});
