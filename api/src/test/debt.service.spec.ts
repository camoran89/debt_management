import { Test, TestingModule } from '@nestjs/testing';
import { DebtService } from '../application/debt/debt.service';
import { CreateDebtUseCase } from '../application/debt/create-debt.use-case';
import { IDebtRepository } from '../domain/debt/debt-repository.interface';
import { DEBT_REPOSITORY_TOKEN } from '../domain/debt/debt-repository.token';
import { PayDebtUseCase } from '../application/debt/pay-debt.use-case';
import { CreateDebtDto } from '../infrastructure/web/dto/create-debt.dto';

const mockDebtRepository = {
  save: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  markAsPaid: jest.fn(),
  delete: jest.fn(),
};

describe('DebtService', () => {
  let service: DebtService;
  let createDebtUseCase: CreateDebtUseCase;
  let debtRepository: IDebtRepository;
  let payDebtUseCase: PayDebtUseCase;

  beforeEach(async () => {
  const mockPayDebtUseCase = { execute: jest.fn() } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DebtService,
        {
          provide: CreateDebtUseCase,
          useFactory: (debtRepository: IDebtRepository) => new CreateDebtUseCase(debtRepository),
          inject: [DEBT_REPOSITORY_TOKEN],
        },
        {
          provide: PayDebtUseCase,
          useValue: mockPayDebtUseCase,
        },
        { provide: DEBT_REPOSITORY_TOKEN, useValue: mockDebtRepository },
      ],
    }).compile();

    service = module.get<DebtService>(DebtService);
    createDebtUseCase = module.get<CreateDebtUseCase>(CreateDebtUseCase);
    debtRepository = module.get<IDebtRepository>(DEBT_REPOSITORY_TOKEN);
    payDebtUseCase = module.get<PayDebtUseCase>(PayDebtUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a debt', async () => {
    const dto = new CreateDebtDto(1, 100, 'Loan');
    mockDebtRepository.save.mockResolvedValue({ id: 1, ...dto });
  const result = await service.create(dto, 1);
    expect(result).toHaveProperty('id');
    expect(mockDebtRepository.save).toHaveBeenCalled();
  });
  it('should find all debts by user', async () => {
    mockDebtRepository.findByUserId.mockResolvedValue([{ id: 1, user_id: 1 }]);
    const result = await service.findAllByUser(1);
    expect(result.length).toBeGreaterThan(0);
    expect(mockDebtRepository.findByUserId).toHaveBeenCalledWith(1);
  });

  it('should find one debt', async () => {
    mockDebtRepository.findById.mockResolvedValue({ id: 1, user_id: 1 });
    const result = await service.findOne(1);
    expect(result.id).toBe(1);
  });

  it('should throw NotFoundException if debt not found', async () => {
    mockDebtRepository.findById.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow('Deuda no encontrada');
  });

  it('should update a debt', async () => {
    const debt = { id: 1, is_paid: false };
    mockDebtRepository.findById.mockResolvedValue(debt);
    mockDebtRepository.save.mockResolvedValue({ ...debt, amount: 200 });
    const result = await service.update(1, { amount: 200 });
    expect(result.amount).toBe(200);
  });

  it('should throw ForbiddenException if updating a paid debt', async () => {
    const debt = { id: 1, is_paid: true };
    mockDebtRepository.findById.mockResolvedValue(debt);
    await expect(service.update(1, { amount: 200 })).rejects.toThrow('No se puede modificar una deuda pagada');
  });

  it('should remove a debt', async () => {
    const debt = { id: 1, is_paid: false };
    mockDebtRepository.findById.mockResolvedValue(debt);
    mockDebtRepository.delete.mockResolvedValue(undefined);
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockDebtRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw ForbiddenException if removing a paid debt', async () => {
    const debt = { id: 1, is_paid: true };
    mockDebtRepository.findById.mockResolvedValue(debt);
    await expect(service.remove(1)).rejects.toThrow('No se puede eliminar una deuda pagada');
  });

  it('should mark a debt as paid', async () => {
    (payDebtUseCase.execute as jest.Mock).mockResolvedValue({
      id: 1,
      user_id: 1,
      amount: 100,
      is_paid: true,
      description: 'desc',
    });
    const result = await service.markAsPaid(1);
    expect(result.is_paid).toBe(true);
    expect(payDebtUseCase.execute).toHaveBeenCalledWith(1);
  });
});
