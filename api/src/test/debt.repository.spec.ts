import { DebtRepository } from '../infrastructure/repositories/debt.repository';
import { Repository } from 'typeorm';
import { DebtEntity } from '../domain/debt/debt.entity';

describe('DebtRepository', () => {
  let repo: DebtRepository;
  let ormRepo: jest.Mocked<Repository<DebtEntity>>;

  beforeEach(() => {
    ormRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    } as any;
    repo = new DebtRepository(ormRepo);
  });

  it('should save a debt', async () => {
    const debt = new DebtEntity(1, 100, false, 'desc');
    ormRepo.save.mockResolvedValue({ ...debt, id: 1 });
    const result = await repo.save(debt);
    expect(result.id).toBe(1);
  });

  it('should find by id', async () => {
    ormRepo.findOne.mockResolvedValue({ id: 1, user_id: 1 } as DebtEntity);
    const result = await repo.findById(1);
    expect(result?.id).toBe(1);
  });
  it('should find by user id', async () => {
    ormRepo.find.mockResolvedValue([{ id: 1, user_id: 1 } as DebtEntity]);
    const result = await repo.findByUserId(1);
    expect(result[0].user_id).toBe(1);
  });

  it('should delete a debt', async () => {
    ormRepo.delete.mockResolvedValue({} as any);
    await expect(repo.delete(1)).resolves.toBeUndefined();
    expect(ormRepo.delete).toHaveBeenCalledWith(1);
  });
});
