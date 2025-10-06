import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { CreateDebtUseCase } from '../../application/debt/create-debt.use-case';
import { PayDebtUseCase } from '../../application/debt/pay-debt.use-case';
import { IDebtRepository } from '../../domain/debt/debt-repository.interface';
import { DebtEntity } from '../../domain/debt/debt.entity';
import { CreateDebtDto } from '../../infrastructure/web/dto/create-debt.dto';
import { UpdateDebtDto } from '../../infrastructure/web/dto/update-debt.dto';
import Redis from 'ioredis';

@Injectable()
export class DebtService {
  private redis: Redis;

  constructor(
    private readonly createDebtUseCase: CreateDebtUseCase,
    private readonly payDebtUseCase: PayDebtUseCase,
    @Inject('DEBT_REPOSITORY_TOKEN') private readonly debtRepository: IDebtRepository,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });
  }

  async create(createDebtDto: CreateDebtDto, userId: number): Promise<DebtEntity> {
    const debt = await this.createDebtUseCase.execute(createDebtDto, userId);
    await this.redis.set(`debt:${debt.id}`, JSON.stringify(debt));
    return debt;
  }

  async findAllByUser(user_id: number): Promise<DebtEntity[]> {
    return this.debtRepository.findByUserId(user_id);
  }

  async findOne(id: number): Promise<DebtEntity> {
    const cached = await this.redis.get(`debt:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }
    const debt = await this.debtRepository.findById(id);
    if (!debt) throw new NotFoundException('Deuda no encontrada');
    await this.redis.set(`debt:${id}`, JSON.stringify(debt));
    return debt;
  }

  async update(id: number, updateDebtDto: UpdateDebtDto): Promise<DebtEntity> {
    const debt = await this.findOne(id);
    if (debt.is_paid) throw new ForbiddenException('No se puede modificar una deuda pagada');
    Object.assign(debt, updateDebtDto);
    const updated = await this.debtRepository.save(debt);
    await this.redis.set(`debt:${id}`, JSON.stringify(updated));
    return updated;
  }

  async remove(id: number): Promise<void> {
    const debt = await this.findOne(id);
    if (debt.is_paid) throw new ForbiddenException('No se puede eliminar una deuda pagada');
    await this.debtRepository.delete(id);
    await this.redis.del(`debt:${id}`);
  }

  async markAsPaid(id: number): Promise<DebtEntity> {
    const paid = await this.payDebtUseCase.execute(id);
    await this.redis.set(`debt:${id}`, JSON.stringify(paid));
    return paid;
  }
}
