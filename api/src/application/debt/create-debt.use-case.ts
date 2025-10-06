import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { DEBT_REPOSITORY_TOKEN } from '../../domain/debt/debt-repository.token';
import { IDebtRepository } from '../../domain/debt/debt-repository.interface';
import { DebtEntity } from '../../domain/debt/debt.entity';
import { CreateDebtDto } from '../../infrastructure/web/dto/create-debt.dto';

@Injectable()
export class CreateDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY_TOKEN)
    private readonly debtRepository: IDebtRepository,
  ) {}

  async execute(createDebtDto: CreateDebtDto, userId: number): Promise<DebtEntity> {
    if (createDebtDto.amount <= 0) {
      throw new BadRequestException('El monto debe ser positivo');
    }

    const debt = new DebtEntity(
      userId,
      createDebtDto.amount,
      false,
      createDebtDto.description,
    );

    return this.debtRepository.save(debt);
  }
}
