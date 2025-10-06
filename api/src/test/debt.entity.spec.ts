import { DebtEntity } from '../domain/debt/debt.entity';

describe('DebtEntity', () => {
  it('should create a debt entity with required fields', () => {
    const debt = new DebtEntity(1, 100, false, 'desc');
    expect(debt.user_id).toBe(1);
    expect(debt.amount).toBe(100);
    expect(debt.is_paid).toBe(false);
    expect(debt.description).toBe('desc');
    expect(debt.id).toBeUndefined();
  });

  it('should set paid_at if provided', () => {
    const date = new Date();
    const debt = new DebtEntity(1, 100, true, 'desc', date);
    expect(debt.paid_at).toBe(date);
  });
});
