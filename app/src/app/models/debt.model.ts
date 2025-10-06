export interface Debt {
  id: number;
  amount: number;
  description: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt?: string;
  paidAt?: string;
}

export interface CreateDebtDto {
  amount: number;
  description: string;
}

export interface UpdateDebtDto {
  amount?: number;
  description?: string;
}

export enum DebtStatus {
  PENDING = 'pending',
  PAID = 'paid'
}

export interface DebtFilter {
  status: 'all' | 'pending' | 'paid';
}