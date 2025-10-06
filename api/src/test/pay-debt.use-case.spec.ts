import { PayDebtUseCase } from '../application/debt/pay-debt.use-case';
import { IDebtRepository } from '../domain/debt/debt-repository.interface';
import { DebtEntity } from '../domain/debt/debt.entity';

describe('PayDebtUseCase', () => {
  let useCase: PayDebtUseCase;
  let debtRepository: jest.Mocked<IDebtRepository>;

  beforeEach(() => {
    debtRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new PayDebtUseCase(debtRepository);
  });

  it('should mark debt as paid if not already paid', async () => {
    const debt = { id: 1, is_paid: false } as DebtEntity;
    debtRepository.findById.mockResolvedValue(debt);
    debtRepository.save.mockImplementation(async (d) => ({ ...d, is_paid: true, paid_at: new Date() } as DebtEntity));
    const result = await useCase.execute(1);
    expect(result.is_paid).toBe(true);
    expect(debtRepository.save).toHaveBeenCalled();
  });

  it('should throw if debt not found', async () => {
    debtRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow('Deuda no encontrada');
  });

  it('should throw if debt already paid', async () => {
    const debt = { id: 1, is_paid: true } as DebtEntity;
    debtRepository.findById.mockResolvedValue(debt);
    await expect(useCase.execute(1)).rejects.toThrow('La deuda ya está pagada');
  });
});
