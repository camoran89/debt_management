import { DebtController } from '../infrastructure/web/controllers/debt.controller';
import { DebtService } from '../application/debt/debt.service';
import { CreateDebtDto } from '../infrastructure/web/dto/create-debt.dto';

describe('DebtController', () => {
  let controller: DebtController;
  let debtService: jest.Mocked<DebtService>;

  beforeEach(() => {
    debtService = {
      create: jest.fn(),
      findAllByUser: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  markAsPaid: jest.fn(),
    } as any;
    controller = new DebtController(debtService);
  });

  it('should create a debt', async () => {
    debtService.create.mockResolvedValue({ id: 1, user_id: 1, amount: 100, is_paid: false });
    const dto = { user_id: 1, amount: 100, description: 'desc' } as CreateDebtDto;
    const req = { user: { userId: 1 } } as any;
    const result = await controller.create(dto, req);
    expect(result).toHaveProperty('id');
  });

  it('should list debts for user', async () => {
    debtService.findAllByUser.mockResolvedValue([{ id: 1, user_id: 1, amount: 100, is_paid: false }]);
    const req = { user: { userId: 1 } } as any;
    const result = await controller.findAll(req);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get debt by id', async () => {
    debtService.findOne.mockResolvedValue({ id: 1, user_id: 1, amount: 100, is_paid: false });
    const result = await controller.findOne(1);
    expect(result).toHaveProperty('id', 1);
  });
  it('should update a debt', async () => {
    debtService.update.mockResolvedValue({ id: 1, user_id: 1, amount: 200, is_paid: false, description: 'desc' });
    const result = await controller.update(1, { amount: 200 });
    expect(result.amount).toBe(200);
  });

  it('should remove a debt', async () => {
    debtService.remove.mockResolvedValue(undefined);
    await expect(controller.remove(1)).resolves.toBeUndefined();
    expect(debtService.remove).toHaveBeenCalledWith(1);
  });

  it('should mark a debt as paid', async () => {
    debtService.markAsPaid.mockResolvedValue({ id: 1, user_id: 1, amount: 100, is_paid: true, description: 'desc' });
    const result = await controller.markAsPaid(1);
    expect(result.is_paid).toBe(true);
  });

  it('should handle error on update', async () => {
    debtService.update.mockRejectedValue(new Error('No se puede modificar una deuda pagada'));
    await expect(controller.update(1, { amount: 200 })).rejects.toThrow('No se puede modificar una deuda pagada');
  });

  it('should handle error on remove', async () => {
    debtService.remove.mockRejectedValue(new Error('No se puede eliminar una deuda pagada'));
    await expect(controller.remove(1)).rejects.toThrow('No se puede eliminar una deuda pagada');
  });

  it('should handle error on markAsPaid', async () => {
    debtService.markAsPaid.mockRejectedValue(new Error('La deuda ya está pagada'));
    await expect(controller.markAsPaid(1)).rejects.toThrow('La deuda ya está pagada');
  });
});
