import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { CreateDebtUseCase } from '../../application/debt/create-debt.use-case';
import { PayDebtUseCase } from '../../application/debt/pay-debt.use-case';
import { IDebtRepository } from '../../domain/debt/debt-repository.interface';
import { DebtEntity } from '../../domain/debt/debt.entity';
import { CreateDebtDto } from '../../infrastructure/web/dto/create-debt.dto';
import { UpdateDebtDto } from '../../infrastructure/web/dto/update-debt.dto';

@Injectable()
export class DebtService {
  constructor(
    private readonly createDebtUseCase: CreateDebtUseCase,
    private readonly payDebtUseCase: PayDebtUseCase,
    @Inject('DEBT_REPOSITORY_TOKEN') private readonly debtRepository: IDebtRepository,
  ) {}

  async create(createDebtDto: CreateDebtDto, userId: number): Promise<DebtEntity> {
    return this.createDebtUseCase.execute(createDebtDto, userId);
  }

  async findAllByUser(user_id: number): Promise<DebtEntity[]> {
    return this.debtRepository.findByUserId(user_id);
  }

  async findOne(id: number): Promise<DebtEntity> {
    const debt = await this.debtRepository.findById(id);
    if (!debt) throw new NotFoundException('Deuda no encontrada');
    return debt;
  }

  async update(id: number, updateDebtDto: UpdateDebtDto): Promise<DebtEntity> {
    const debt = await this.findOne(id);
    if (debt.is_paid) throw new ForbiddenException('No se puede modificar una deuda pagada');
    Object.assign(debt, updateDebtDto);
    return this.debtRepository.save(debt);
  }

  async remove(id: number): Promise<void> {
    const debt = await this.findOne(id);
    if (debt.is_paid) throw new ForbiddenException('No se puede eliminar una deuda pagada');
    await this.debtRepository.delete(id);
  }

  async markAsPaid(id: number): Promise<DebtEntity> {
    return this.payDebtUseCase.execute(id);
  }
}
