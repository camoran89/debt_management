import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IDebtRepository } from '../../domain/debt/debt-repository.interface';
import { DebtEntity } from '../../domain/debt/debt.entity';

@Injectable()
export class PayDebtUseCase {
  constructor(private readonly debtRepository: IDebtRepository) {}

  async execute(id: number): Promise<DebtEntity> {
    const debt = await this.debtRepository.findById(id);
    if (!debt) {
      throw new NotFoundException('Deuda no encontrada');
    }

    if (debt.is_paid) {
      throw new ForbiddenException('La deuda ya está pagada');
    }

    debt.is_paid = true;
    debt.paid_at = new Date();
    return this.debtRepository.save(debt);
  }
}
