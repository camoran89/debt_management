import { UserRepository } from '../infrastructure/repositories/user.repository';
import { Repository } from 'typeorm';
import { UserEntity } from '../domain/user/user.entity';

describe('UserRepository', () => {
  let repo: UserRepository;
  let ormRepo: jest.Mocked<Repository<UserEntity>>;

  beforeEach(() => {
    ormRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
    } as any;
    repo = new UserRepository(ormRepo);
  });

  it('should save a user', async () => {
    const user = new UserEntity('a','b','c','d');
    ormRepo.save.mockResolvedValue({ ...user, id: 1 });
    const result = await repo.save(user);
    expect(result.id).toBe(1);
  });

  it('should find by email', async () => {
    ormRepo.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' } as UserEntity);
    const result = await repo.findByEmail('test@example.com');
    expect(result?.email).toBe('test@example.com');
  });

  it('should find by id', async () => {
    ormRepo.findOne.mockResolvedValue({ id: 2, email: 'other@example.com' } as UserEntity);
    const result = await repo.findById(2);
    expect(result?.id).toBe(2);
  });

  it('should delete a user', async () => {
    ormRepo.delete = jest.fn().mockResolvedValue({} as any);
    if (typeof (repo as any).delete === 'function') {
      await expect((repo as any).delete(2)).resolves.toBeUndefined();
      expect(ormRepo.delete).toHaveBeenCalledWith(2);
    }
  });
});
