import { DebtEntity } from './debt.entity';

export interface IDebtRepository {
  save(debt: DebtEntity): Promise<DebtEntity>;
  findById(id: number): Promise<DebtEntity | null>;
  findByUserId(userId: number): Promise<DebtEntity[]>;
  delete(id: number): Promise<void>;
}
