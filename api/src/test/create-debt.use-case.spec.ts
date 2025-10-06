import { CreateDebtUseCase } from '../application/debt/create-debt.use-case';
import { IDebtRepository } from '../domain/debt/debt-repository.interface';
import { CreateDebtDto } from '../infrastructure/web/dto/create-debt.dto';
import { DebtEntity } from '../domain/debt/debt.entity';

describe('CreateDebtUseCase', () => {
  let useCase: CreateDebtUseCase;
  let debtRepository: jest.Mocked<IDebtRepository>;

  beforeEach(() => {
    debtRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateDebtUseCase(debtRepository);
  });

  it('should create a debt if amount is positive', async () => {
    const dto = { user_id: 1, amount: 100, description: 'desc' } as CreateDebtDto;
    debtRepository.save.mockImplementation(async (debt) => ({ ...debt, id: 1 } as DebtEntity));
    const result = await useCase.execute(dto, 1);
    expect(result).toHaveProperty('id');
    expect(debtRepository.save).toHaveBeenCalled();
  });

  it('should throw if amount is not positive', async () => {
    const dto = { user_id: 1, amount: 0, description: 'desc' } as CreateDebtDto;
    await expect(useCase.execute(dto, 1)).rejects.toThrow('El monto debe ser positivo');
  });
});
