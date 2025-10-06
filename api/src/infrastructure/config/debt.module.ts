import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtEntity } from '../../domain/debt/debt.entity';
import { DebtService } from '../../application/debt/debt.service';
import { DebtController } from '../web/controllers/debt.controller';

import { DebtRepository } from '../repositories/debt.repository';
import { CreateDebtUseCase } from '../../application/debt/create-debt.use-case';
import { PayDebtUseCase } from '../../application/debt/pay-debt.use-case';
import { DEBT_REPOSITORY_TOKEN } from '../../domain/debt/debt-repository.token';

@Module({
  imports: [TypeOrmModule.forFeature([DebtEntity])],
  providers: [
    DebtService,
    CreateDebtUseCase,
    {
      provide: PayDebtUseCase,
      useFactory: (debtRepository) => new PayDebtUseCase(debtRepository),
      inject: [DEBT_REPOSITORY_TOKEN],
    },
    { provide: DEBT_REPOSITORY_TOKEN, useClass: DebtRepository },
  ],
  controllers: [DebtController],
  exports: [DebtService, DEBT_REPOSITORY_TOKEN, CreateDebtUseCase],
})
export class DebtModule {}
