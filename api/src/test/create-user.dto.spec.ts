import { CreateUserDto } from '../infrastructure/web/dto/create-user.dto';
import { validate } from 'class-validator';

describe('CreateUserDto', () => {
  it('should fail validation if required fields are missing', async () => {
  const dto = new CreateUserDto('', '', '', '');
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
