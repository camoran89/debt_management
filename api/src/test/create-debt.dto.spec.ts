import { CreateDebtDto } from '../infrastructure/web/dto/create-debt.dto';
import { validate } from 'class-validator';

describe('CreateDebtDto', () => {
  it('should fail validation if required fields are missing', async () => {
  const dto = new CreateDebtDto(undefined as any, undefined as any, '');
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
