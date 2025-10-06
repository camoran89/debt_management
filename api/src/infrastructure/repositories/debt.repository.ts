import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DebtEntity } from '../../domain/debt/debt.entity';
import { IDebtRepository } from '../../domain/debt/debt-repository.interface';

@Injectable()
export class DebtRepository implements IDebtRepository {
  constructor(
    @InjectRepository(DebtEntity)
    private readonly repository: Repository<DebtEntity>,
  ) {}

  async save(debt: DebtEntity): Promise<DebtEntity> {
    return this.repository.save(debt);
  }

  async findById(id: number): Promise<DebtEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: number): Promise<DebtEntity[]> {
    return this.repository.find({ where: { user_id: userId } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
